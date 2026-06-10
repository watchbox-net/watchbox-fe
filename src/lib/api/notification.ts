import { privateApi } from './client';

/**
 * 스낵바 노출 ACK — 알림을 스낵바로 띄운 직후 호출.
 * 호출하지 않으면 재구독(catchup) 시 동일 알림이 다시 내려옴.
 *
 * @param notificationIds 노출 완료한 알림 ID 목록
 */
export async function ackSnackbarShown(notificationIds: number[]): Promise<void> {
  if (notificationIds.length === 0) return;
  await privateApi.post('/notifications/snackbar-shown', notificationIds);
}
