import MobileFrame from '@/components/common/MobileFrame';
import BottomNav from '@/components/common/BottomNav';
import PathTracker from '@/components/common/PathTracker';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileFrame>
      <PathTracker />
      {children}
      <BottomNav />
    </MobileFrame>
  );
}
