'use client';

interface TabsProps<T extends string> {
  tabs: { value: T; label: string }[];
  activeTab: T;
  onChange: (tab: T) => void;
  size?: 'sm' | 'md';
}

export default function Tabs<T extends string>({ tabs, activeTab, onChange, size = 'md' }: TabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            ${size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'}
            font-medium rounded-t-lg transition-colors
            ${activeTab === tab.value
              ? 'bg-green-600 text-white border-b-2 border-green-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
