import Spinner from '@/components/common/Loading';
import { Loading } from '@/components/common/Loading';

export default function SpinnerDemoPage() {
  return (
    <div className="flex flex-col gap-10 p-6">
      <h1 className="text-xl font-bold text-white">Spinner Demo</h1>

      {/* 크기별 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-wb-grey-03">크기별 Spinner</h2>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Spinner size={16} />
            <span className="text-xs text-wb-grey-03">16px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size={24} />
            <span className="text-xs text-wb-grey-03">24px (기본)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size={32} />
            <span className="text-xs text-wb-grey-03">32px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size={48} />
            <span className="text-xs text-wb-grey-03">48px</span>
          </div>
        </div>
      </section>

      {/* Loading 컴포넌트 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-wb-grey-03">Loading (중앙 배치)</h2>
        <div className="rounded-lg border border-wb-grey-01">
          <Loading />
        </div>
        <div className="rounded-lg border border-wb-grey-01">
          <Loading text="불러오는 중" />
        </div>
        <div className="rounded-lg border border-wb-grey-01">
          <Loading size={48} text="컨텐츠를 불러오고 있습니다" />
        </div>
      </section>

      {/* 버튼 안 사용 예시 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-wb-grey-03">버튼 내 Spinner</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-wb-primary px-4 py-2 text-sm font-medium text-black">
            <Spinner size={16} />
            저장 중...
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-wb-grey-01 px-4 py-2 text-sm font-medium text-white">
            <Spinner size={16} />
            로딩 중
          </button>
        </div>
      </section>
    </div>
  );
}
