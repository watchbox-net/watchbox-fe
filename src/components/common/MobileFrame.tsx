export default function MobileFrame({
    children
}: {
    children: React.ReactNode
}) {
    return (
        // <div className="mx-auto max-w-[393px] min-h-screen bg-neutral-950 text-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] flex flex-col">
        <div className="mx-auto max-w-[393px] min-h-screen bg-white shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">

            {children}
        </div>
    );
}