'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import SnackBar from '@/components/common/SnackBar';
import { useAuth } from './AuthContext';
import { ackSnackbarShown } from '@/lib/api/notification';
import type { NotificationResponse } from '@/types/notification';

// ── 멀티탭/재구독 중복 노출 방지용 localStorage dedup ──────────
const DEDUP_KEY = 'wb-shown-notification-ids';
const DEDUP_MAX = 100;

function getShownIds(): number[] {
  try {
    const raw = localStorage.getItem(DEDUP_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function isAlreadyShown(id: number): boolean {
  return getShownIds().includes(id);
}

function markShown(id: number): void {
  try {
    const ids = getShownIds();
    if (!ids.includes(id)) {
      ids.push(id);
      // 무한 증가 방지 — 최근 DEDUP_MAX개만 유지
      localStorage.setItem(DEDUP_KEY, JSON.stringify(ids.slice(-DEDUP_MAX)));
    }
  } catch {
    /* localStorage 접근 실패 시 무시 */
  }
}

// 초대 알림 보러가기 → 초대 화면
const INVITATIONS_PATH = '/box/invitations';
// 자동 소멸 시간
const CONTENT_TOAST_MS = 8000;    // 컨텐츠 추가 알림
const INVITATION_TOAST_MS = 20000; // 초대 받음 / 수락·거절 알림

// ── 스낵바 큐 항목 ────────────────────────────────────────────
interface SnackItem {
  notificationId: number;
  highlight: string;
  message: ReactNode;
  /** 보러가기 클릭 시 이동 경로 */
  href: string;
  /** 지정 시 N ms 후 자동 소멸 (미지정 시 사용자가 직접 닫을 때까지 유지) */
  autoDismissMs?: number;
  /** 버스트 대체 키 — 같은 키의 대기 중 토스트는 최신으로 교체 */
  groupKey?: string;
}

/** 굵게 강조 */
function Bold({ children }: { children: ReactNode }) {
  return <span className="font-semibold">{children}</span>;
}

/** 받침 유무로 목적격 조사(을/를) 선택. 비한글은 '을'로 폴백 */
function objectParticle(word: string): '을' | '를' {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return '을';
  return (code - 0xac00) % 28 > 0 ? '을' : '를';
}

/** 박스 컨텐츠 페이지 경로 (박스 목록의 이동 규칙과 동일) */
function boxContentsPath(boxId: number, boxType: string, boxName: string): string {
  return `/box/${boxId}/contents?type=${boxType}&name=${encodeURIComponent(boxName)}`;
}

/**
 * 알림 응답 → 스낵바 표시 데이터로 변환.
 * 지원: BOX_INVITATION_RECEIVED, BOX_INVITATION_RESPONDED, BOX_CONTENT_ADDED.
 * 그 외 타입은 null 반환(스낵바 미표시).
 */
function buildSnackItem(n: NotificationResponse): SnackItem | null {
  const p = n.payload;

  if (p.type === 'BOX_INVITATION_RECEIVED') {
    return {
      notificationId: n.notificationId,
      highlight: p.sender,
      message: (
        <Fragment>
          님이 <Bold>{p.boxName}</Bold>에 초대했어요
        </Fragment>
      ),
      href: INVITATIONS_PATH,
      autoDismissMs: INVITATION_TOAST_MS, // 20초 후 자동 소멸
    };
  }

  if (p.type === 'BOX_INVITATION_RESPONDED') {
    const action =
      p.requestStatus === 'ACCEPTED'
        ? '수락'
        : p.requestStatus === 'REJECTED'
          ? '거절'
          : null;
    if (!action) return null; // PENDING은 알림 대상 아님
    return {
      notificationId: n.notificationId,
      highlight: p.responder,
      message: (
        <Fragment>
          님이 <Bold>{p.boxName}</Bold> 초대를 <Bold>{action}</Bold>했어요
        </Fragment>
      ),
      href: INVITATIONS_PATH,
      autoDismissMs: INVITATION_TOAST_MS, // 20초 후 자동 소멸
    };
  }

  if (p.type === 'BOX_CONTENT_ADDED') {
    return {
      notificationId: n.notificationId,
      highlight: p.publisher,
      message: (
        <Fragment>
          님이 <Bold>{p.boxName}</Bold>에 <Bold>{p.contentName}</Bold>
          {objectParticle(p.contentName)} 추가했어요
        </Fragment>
      ),
      href: boxContentsPath(p.boxId, p.boxType, p.boxName),
      autoDismissMs: CONTENT_TOAST_MS, // 8초 후 자동 소멸
      groupKey: `box:${p.boxId}`, // 같은 박스 버스트 시 최신으로 대체
    };
  }

  return null;
}

const NotificationContext = createContext<null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // 동시에 여러 알림이 와도 하나씩 순차 노출 (큐의 맨 앞이 현재 표시 항목)
  const [queue, setQueue] = useState<SnackItem[]>([]);
  const current = queue[0] ?? null;

  // 최신 핸들러를 ref로 유지 → SSE effect가 isAuthenticated에만 의존하도록
  const handleRef = useRef<(n: NotificationResponse) => void>(() => {});

  const handleNotification = useCallback((n: NotificationResponse) => {
    // 받은 초대 알림 → 벨 배지 즉시 갱신 (snackbar 표시 여부/dedup과 무관하게)
    if (n.type === 'BOX_INVITATION_RECEIVED') {
      queryClient.invalidateQueries({ queryKey: ['hasReceivedInvitation'] });
    }

    if (!n.showSnackbar) return;
    if (isAlreadyShown(n.notificationId)) return;

    const item = buildSnackItem(n);
    if (!item) return; // 미지원 타입

    // 노출 확정 → dedup 마킹 + 큐 추가 + 서버 ACK (재노출 방지)
    markShown(n.notificationId);
    setQueue((q) => {
      // 버스트 대체: 같은 groupKey의 "대기 중"(현재 표시 항목 제외) 토스트는 최신으로 교체
      if (item.groupKey) {
        const filtered = q.filter(
          (it, idx) => idx === 0 || it.groupKey !== item.groupKey,
        );
        return [...filtered, item];
      }
      return [...q, item];
    });
    ackSnackbarShown([n.notificationId]).catch(() => {
      /* ACK 실패해도 UX는 진행 — 최악의 경우 재구독 시 다시 옴 */
    });
  }, [queryClient]);

  useEffect(() => {
    handleRef.current = handleNotification;
  }, [handleNotification]);

  // ── SSE 구독 (로그인 상태에서만) ───────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    const onNotification = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as NotificationResponse;
        handleRef.current(data);
      } catch {
        /* 파싱 실패 무시 */
      }
    };

    const connect = () => {
      if (closed) return;
      es = new EventSource('/api/notifications/subscribe', { withCredentials: true });
      // 'connect' 핸드셰이크 이벤트는 무시, 'notification'만 처리
      es.addEventListener('notification', onNotification);
      es.onerror = () => {
        // 네이티브 EventSource는 HTTP 에러(502 등, 백엔드 재시작 시)엔 재연결을 포기(CLOSED).
        // 그 경우만 수동 재연결. CONNECTING이면 브라우저 자동 재연결에 맡김.
        if (es?.readyState === EventSource.CLOSED && !closed) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.removeEventListener('notification', onNotification);
      es?.close();
    };
  }, [isAuthenticated]);

  const dismissCurrent = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  // 자동 소멸 — 현재 항목에 autoDismissMs가 있으면 타이머로 다음으로 넘김
  useEffect(() => {
    if (!current?.autoDismissMs) return;
    const timer = setTimeout(dismissCurrent, current.autoDismissMs);
    return () => clearTimeout(timer);
  }, [current, dismissCurrent]);

  const handleAction = useCallback(() => {
    const href = current?.href;
    dismissCurrent();
    if (href) router.push(href);
  }, [current, dismissCurrent, router]);

  return (
    <NotificationContext.Provider value={null}>
      {children}
      {current && (
        <SnackBar
          key={current.notificationId}
          visible
          highlight={current.highlight}
          message={current.message}
          actionLabel="보러가기"
          onAction={handleAction}
          onClose={dismissCurrent}
        />
      )}
    </NotificationContext.Provider>
  );
}

// 현재는 SSE 구동 전용이라 노출 값이 없지만, 향후 확장 대비 hook 유지
export function useNotification() {
  return useContext(NotificationContext);
}
