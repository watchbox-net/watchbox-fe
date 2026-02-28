import BottomMenu from "@/components/common/BottomMenu";
import Header from "@/components/common/Header";
import MobileFrame from "@/components/common/MobileFrame";
import Link from "next/link";

const DISCOVER_LINKS = [
    { href: '/discover/popular/movie', label: '인기 영화' },
    { href: '/discover/popular/tv', label: '인기 시리즈' },
    { href: '/discover/top-rated/movie', label: '높은 평가 영화' },
    { href: '/discover/top-rated/tv', label: '높은 평가 시리즈' },
];

export default function HomePage(){
    return (
        <MobileFrame>
            <Header />
            <main className="p-4">
                <h1 className="text-xl font-bold mb-4">홈화면</h1>
                <div className="flex flex-col gap-2">
                    {DISCOVER_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="p-3 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </main>
            <BottomMenu />
        </MobileFrame>
    );
}