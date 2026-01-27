import MobileFrame from "@/components/common/MobileFrame";
import Header from "@/components/common/Header";
import BottomMenu from "@/components/common/BottomMenu";

export default function BoxPage() {
    return (
        <MobileFrame>
            <Header />
            <main>
                <h1>박스 화면</h1>
                {/* 콘텐츠 */}
            </main>
            <BottomMenu />
        </MobileFrame>
    );
}