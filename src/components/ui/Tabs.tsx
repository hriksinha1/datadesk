import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface UnderlineTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const UnderlineTabs: React.FC<UnderlineTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-6 border-b border-[#E4E7EC] overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap -mb-[1px] select-none ${
              isActive
                ? 'border-[#0D5C4D] text-[#0D5C4D]'
                : 'border-transparent text-[#64748B] hover:text-[#0E1726]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.2 rounded-[4px] tabular-nums font-medium ${
                  isActive ? 'bg-[#EAF4F1] text-[#0D5C4D]' : 'bg-[#F7F8FA] text-[#64748B]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

interface SegmentedTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
  size = 'md',
}) => {
  const containerHeight = size === 'sm' ? 'h-8 p-0.5' : 'h-9 p-1';
  const tabPadding = size === 'sm' ? 'px-2.5 text-xs' : 'px-3 text-sm';

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px] ${containerHeight} ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 h-full font-medium rounded-[4px] transition-all cursor-pointer whitespace-nowrap select-none ${tabPadding} ${
              isActive
                ? 'bg-white text-[#0E1726] shadow-none border border-[#CBD2DC]/40'
                : 'text-[#64748B] hover:text-[#0E1726]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs px-1.5 rounded-[4px] tabular-nums ${
                  isActive ? 'bg-[#F7F8FA] text-[#0E1726]' : 'bg-white text-[#64748B]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
