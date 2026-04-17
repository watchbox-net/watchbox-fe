'use client';

interface TabNavProps {
  /** 탭 라벨 배열 */
  tabs: string[];
  /** 활성 탭 인덱스 */
  activeIndex: number;
  /** 탭 변경 핸들러 */
  onChange?: (index: number) => void;
}

export default function TabNav({ tabs, activeIndex, onChange }: TabNavProps) {
  return (
    <nav className="flex w-full">
      {tabs.map((label, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange?.(i)}
            className={`flex-1 pt-[9px] pb-[10px] px-[10px] wb-menu-tab text-center border-b ${
              isActive
                ? 'text-wb-white-02 border-wb-white'
                : 'text-wb-grey-03 border-wb-grey-03'
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
