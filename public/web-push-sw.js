/* Web Push POC Service Worker
 * 서버가 보내는 payload: { "title": "...", "body": "..." }
 * push 이벤트로 받아 OS 알림(showNotification) 표시.
 * (POC — 실서비스 SSE 알림과는 별개 채널)
 */

// 설치 즉시 활성화 (이전 SW 대기 없이 교체)
self.addEventListener('install', () => {
  self.skipWaiting();
});

// 활성화 시 열려있는 탭 즉시 제어
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 서버 → 브라우저 Push 수신 → OS 알림 표시
self.addEventListener('push', (event) => {
  let payload = { title: 'WatchBox', body: '' };
  try {
    if (event.data) payload = event.data.json();
  } catch {
    if (event.data) payload = { title: 'WatchBox', body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'WatchBox', {
      body: payload.body || '',
      // 클릭 시 라우팅에 쓸 경로 (payload.url 있으면 사용)
      data: { url: payload.url || '/' },
    }),
  );
});

// 알림 클릭 → 이미 열린 탭 포커스, 없으면 새 탭
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate?.(targetUrl);
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
  );
});
