import React from 'react';

export interface StatCellProps {
  label: string;
  value: React.ReactNode;
  caption?: React.ReactNode;
  delta?: { value: string; positive?: boolean };
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export const StatCell: React.FC<StatCellProps> = ({
  label,
  value,
  caption,
  delta,
  onClick,
  active = false,
  className = '',
}) => {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`flex-1 min-w-[140px] p-4 sm:p-5 flex flex-col justify-between transition-colors ${
        isClickable ? 'cursor-pointer hover:bg-[#F7F8FA] focus-visible:outline-2 focus-visible:outline-[#0D5C4D]' : ''
      } ${active ? 'bg-[#EAF4F1]/50 border-b-2 border-b-[#0D5C4D]' : ''} ${className}`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-xs font-medium text-[#64748B] tracking-wide">{label}</span>
        {delta && (
          <span
            className={`text-xs font-medium tabular-nums ${
              delta.positive ? 'text-[#067647]' : 'text-[#B42318]'
            }`}
          >
            {delta.value}
          </span>
        )}
      </div>

      <div className="text-xl sm:text-2xl font-semibold text-[#0E1726] tracking-tight tabular-nums my-0.5">
        {value}
      </div>

      {caption && <div className="text-xs text-[#64748B] mt-1 leading-snug">{caption}</div>}
    </div>
  );
};

export const StatStrip: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 bg-white border border-[#E4E7EC] rounded-[8px] divide-y md:divide-y-0 md:divide-x divide-[#E4E7EC] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
