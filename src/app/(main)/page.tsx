import BottomMenu from "@/components/common/BottomMenu";
import Header from "@/components/common/Header";
import MobileFrame from "@/components/common/MobileFrame";
import Link from "next/link";

export default function HomePage(){
    return (
        <MobileFrame>
            <Header />
            <main>
                <h1>홈화면</h1>
                <Link href={"/discover"}>
                    <div>인기 목록</div>
                </Link>
                {/* 콘텐츠 */}
            </main>
            <BottomMenu />
        </MobileFrame>
    );
}