import BottomNav from "@/components/common/BottomNav";
import Header from "@/components/common/Header";
import MobileFrame from "@/components/common/MobileFrame";

export default function HomePage(){
    return (
        <MobileFrame>
            <Header />
            <main>
                <h1>홈화면</h1>
                {/* 콘텐츠 */}
            </main>
            <BottomNav />
        </MobileFrame>
    );
}