import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileFrame>
      {children}
      <BottomMenu />
    </MobileFrame>
  );
}
