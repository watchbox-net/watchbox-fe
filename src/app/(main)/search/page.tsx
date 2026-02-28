import MobileFrame from "@/components/common/MobileFrame";
import Header from "@/components/common/Header";
import BottomMenu from "@/components/common/BottomMenu";

export default function SearchPage() {
    return (
        <MobileFrame>
            <Header />
            <main>
                <h1 className="text-xl font-bold mb-4">검색화면</h1>
                {/* 콘텐츠 */}
            </main>
            <BottomMenu />
        </MobileFrame>
    );
}