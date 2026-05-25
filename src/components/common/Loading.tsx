interface SpinnerProps {
  /** 스피너 크기 (기본 24px) */
  size?: number;
  className?: string;
}

/** 앰버 링 스피너 */
export default function Spinner({ size = 24, className = '' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-wb-grey-01 border-t-wb-primary ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

interface LoadingProps {
  /** 스피너 크기 (기본 32px) */
  size?: number;
  /** 로딩 텍스트 (없으면 스피너만 표시) */
  text?: string;
  className?: string;
}

/** 전체 영역 중앙 로딩 */
export function Loading({ size = 32, text, className = '' }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <Spinner size={size} />
      {text && <p className="text-sm text-wb-grey-04">{text}</p>}
    </div>
  );
}
