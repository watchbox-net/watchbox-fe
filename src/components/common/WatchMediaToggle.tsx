'use client';

type MediaType = 'movie' | 'tv';

interface WatchMediaToggleProps {
  value: MediaType;
  onChange: (value: MediaType) => void;
}

const OPTIONS: { key: MediaType; label: string }[] = [
  { key: 'movie', label: '영화' },
  { key: 'tv', label: '시리즈' },
];

export default function WatchMediaToggle({ value, onChange }: WatchMediaToggleProps) {
  return (
    <div className="flex h-[22px] items-center rounded-[20px] bg-wb-dark-05">
      {OPTIONS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex h-[22px] items-center justify-center px-[11px] rounded-[20px] shrink-0 text-[12px] font-medium whitespace-nowrap cursor-pointer ${
            value === key
              ? 'bg-wb-primary text-wb-dark-01 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'
              : 'text-wb-grey-03'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
