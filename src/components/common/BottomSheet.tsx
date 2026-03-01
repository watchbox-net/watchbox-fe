'use client';

interface BottomSheetItem {
  icon?: string;
  label: string;
  onClick: () => void;
}

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  items: BottomSheetItem[];
}

export default function BottomSheet({ visible, onClose, items }: BottomSheetProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 시트 */}
      <div className="relative w-full max-w-[430px] bg-neutral-900 rounded-t-2xl pb-6 pt-3">
        <div className="w-10 h-1 bg-neutral-600 rounded-full mx-auto mb-3" />
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-6 py-4 text-left cursor-pointer hover:bg-neutral-800"
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="text-sm text-white">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
