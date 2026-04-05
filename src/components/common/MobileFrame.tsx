export default function MobileFrame({
    children
}: {
    children: React.ReactNode
}) {
    return (
        /* h-dvh: 뷰포트 높이 고정으로 Header/BottomNav 항상 표시, MainContent만 내부 스크롤 */
        <div className="relative mx-auto max-w-[393px] h-dvh bg-wb-dark-02 shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] overflow-hidden flex flex-col">

            {children}
        </div>
    );
}