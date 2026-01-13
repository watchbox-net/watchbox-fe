import MobileFrame from "@/components/common/MobileFrame";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNav";

export default function MyPage() {
    return (
        <MobileFrame>
            <Header />
            <main>
                <h1>마이페이지 화면</h1>
                {/* 콘텐츠 */}
            </main>
            <BottomNav />
        </MobileFrame>
    );
}