import { privateApi } from './client';
import type { ApiResponse } from '@/types/api';

/**
 * Web Push (POC) API + 헬퍼.
 * 백엔드: GET /api/web-push/public-key, POST /api/web-push/subscriptions
 */

/** VAPID 공개키 조회 → PushManager.subscribe({ applicationServerKey })에 사용 */
export async function fetchVapidPublicKey(): Promise<string> {
  const { data } = await privateApi.get<ApiResponse<{ publicKey: string }>>(
    '/web-push/public-key',
  );
  return data.data.publicKey;
}

/** 브라우저 구독 정보 등록 (PushSubscription.toJSON() 형태 그대로 전송) */
export async function registerWebPushSubscription(
  subscription: PushSubscriptionJSON,
): Promise<void> {
  await privateApi.post('/web-push/subscriptions', subscription);
}

/**
 * VAPID 공개키(base64url) → Uint8Array 변환.
 * applicationServerKey는 BufferSource를 받으므로 base64url 문자열을 바이트 배열로 바꿔야 함.
 * (명시적 ArrayBuffer 기반으로 만들어 Uint8Array<ArrayBuffer> 타입 보장)
 */
export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}
