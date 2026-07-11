export type NativeGoogleLoginResult =
  | { status: 'success'; serverAuthCode: string }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

export type NativeAppleLoginResult =
  | { status: 'success'; identityToken: string }
  | { status: 'cancelled' }
  | { status: 'unavailable' }
  | { status: 'error'; message: string };

// WebView 앱이 iOS 인지 판별 (Apple 네이티브 로그인은 iOS 에서만 가능)
export function isIosWebView(): boolean {
  if (typeof navigator === 'undefined') return false;
  return isReactNativeWebView() && /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isReactNativeWebView(): boolean {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView;
}

export function postNativeGoogleLogin(): void {
  if (typeof window === 'undefined') return;
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'NATIVE_GOOGLE_LOGIN' }));
}

export function postNativeAppleLogin(): void {
  if (typeof window === 'undefined') return;
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'NATIVE_APPLE_LOGIN' }));
}

export function waitForNativeResult<T>(responseType: string, timeoutMs = 60000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      window.removeEventListener('rnMessage', handler);
      reject(new Error(`Native response timeout: ${responseType}`));
    }, timeoutMs);

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ type: string } & T>).detail;
      if (detail?.type === responseType) {
        clearTimeout(timer);
        window.removeEventListener('rnMessage', handler);
        resolve(detail);
      }
    };

    window.addEventListener('rnMessage', handler);
  });
}
