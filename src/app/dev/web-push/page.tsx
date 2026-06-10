'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  fetchVapidPublicKey,
  registerWebPushSubscription,
  urlBase64ToUint8Array,
} from '@/lib/api/web-push';

type PermState = NotificationPermission | 'unsupported';

export default function WebPushDevPage() {
  const { isAuthenticated } = useAuth();

  const [permission, setPermission] = useState<PermState>('default');
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const log = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // 현재 권한 + 기존 구독 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported =
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
    if (!supported) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg?.pushManager.getSubscription().then((sub) => {
        if (sub) setEndpoint(sub.endpoint);
      });
    });
  }, []);

  // 권한 요청 + 구독 발급 + 서버 등록 (반드시 버튼 클릭 안에서)
  const enablePush = async () => {
    setBusy(true);
    setLogs([]);
    try {
      if (permission === 'unsupported') {
        log('이 브라우저는 Web Push 미지원');
        return;
      }

      log('Service Worker 등록 시도...');
      const registration = await navigator.serviceWorker.register('/web-push-sw.js');
      await navigator.serviceWorker.ready;
      log('Service Worker 준비 완료');

      log('알림 권한 요청...');
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        log(`권한 미허용: ${result} (거부 시 브라우저 사이트 설정에서 직접 변경 필요)`);
        return;
      }
      log('권한 허용됨 ✓');

      log('VAPID 공개키 조회...');
      const publicKey = await fetchVapidPublicKey();
      log(`공개키 수신 (len=${publicKey.length})`);

      log('PushManager 구독 발급...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      setEndpoint(subscription.endpoint);
      log('구독 발급 완료 ✓');

      log('서버에 구독 등록...');
      await registerWebPushSubscription(subscription.toJSON());
      log('서버 등록 완료 ✅');
      log('이제 관리자 테스트 발송(POST /api/admin/web-push/test)으로 OS 알림 확인 가능');
    } catch (e) {
      log(`에러: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  // OS 알림 직접 테스트 — 푸시 경로(FCM→SW) 안 거치고 바로 showNotification.
  // 이게 뜨면 OS 표시 레이어 정상 → 문제는 푸시 전달 경로.
  // 이것도 안 뜨면 OS 설정(집중모드/브라우저 알림 권한) 문제.
  const testLocalNotification = async () => {
    try {
      if (Notification.permission !== 'granted') {
        log('권한이 granted가 아님 — 먼저 권한 허용 필요');
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification('직접 테스트', {
          body: '개발자 페이지에서 푸시 알림 직접 전송!',
        });
        log('showNotification 호출됨 — 화면에 떴는지 확인');
      } else {
        log('Service Worker 등록 없음 — 먼저 구독 등록 필요');
      }
    } catch (e) {
      log(`직접 알림 에러: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  // 구독 해제 (재테스트용)
  const disablePush = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        setEndpoint(null);
        log('브라우저 구독 해제 완료 (서버 측 구독은 그대로 — POC라 삭제 API 없음)');
      } else {
        log('해제할 구독 없음');
      }
    } catch (e) {
      log(`해제 에러: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const permBadge = {
    granted: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-700',
    unsupported: 'bg-yellow-100 text-yellow-800',
  }[permission];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Web Push (POC)</h1>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        macOS 데스크톱 OS 알림 확인용. 로그인 후 권한 허용 → 구독 등록 → 관리자 테스트 발송으로 확인.
        <br />
        (localhost는 HTTPS 예외라 로컬에서 바로 동작)
      </p>

      {/* 상태 */}
      <section className="border rounded p-4 mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-black">로그인:</span>
          <span className={isAuthenticated ? 'text-green-700' : 'text-red-600'}>
            {isAuthenticated ? '됨' : '안 됨 (먼저 /dev에서 로그인 필요)'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-black">알림 권한:</span>
          <span className={`px-2 py-[2px] rounded text-xs ${permBadge}`}>{permission}</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="font-semibold text-black shrink-0">구독 endpoint:</span>
          <span className="text-gray-600 break-all">
            {endpoint ? `${endpoint.slice(0, 60)}...` : '없음'}
          </span>
        </div>
      </section>

      {/* 액션 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={enablePush}
          disabled={busy || !isAuthenticated || permission === 'unsupported'}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {busy ? '처리 중...' : '권한 허용 + 구독 등록'}
        </button>
        <button
          type="button"
          onClick={disablePush}
          disabled={busy || !endpoint}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
        >
          구독 해제
        </button>
        <button
          type="button"
          onClick={testLocalNotification}
          disabled={permission !== 'granted'}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:bg-gray-300"
        >
          OS 알림 직접 테스트
        </button>
      </div>

      {permission === 'denied' && (
        <p className="text-xs text-red-600 mb-4">
          ⚠️ 권한이 거부 상태입니다. 브라우저 주소창 좌측 🔒 → 알림 → 허용으로 직접 변경 후 다시 시도하세요.
        </p>
      )}

      {/* 로그 */}
      <section className="border rounded p-4">
        <h2 className="font-semibold text-black mb-2 text-sm">진행 로그</h2>
        {logs.length === 0 ? (
          <p className="text-xs text-gray-400">아직 없음</p>
        ) : (
          <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
            {logs.join('\n')}
          </pre>
        )}
      </section>

      <section className="mt-6 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-black">테스트 방법</p>
        <p>1. /dev에서 로그인</p>
        <p>2. 위 &quot;권한 허용 + 구독 등록&quot; 클릭 → 권한 팝업 허용</p>
        <p>3. 관리자가 <code>POST /api/admin/web-push/test?nickname=...&amp;text=...</code> 호출</p>
        <p>4. macOS 우측 상단에 OS 알림 토스트 표시</p>
      </section>
    </div>
  );
}
