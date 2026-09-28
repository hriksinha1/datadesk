import React, { useState } from 'react';
import { Table, BarChart2 } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  dataTable?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  actions,
  children,
  empty = false,
  emptyMessage = 'No data available for this period.',
  dataTable,
  className = '',
}) => {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className={`bg-white border border-[#E4E7EC] rounded-[8px] p-5 flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#0E1726] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {dataTable && !empty && (
            <button
              type="button"
              onClick={() => setShowTable(!showTable)}
              className="p-1 text-[#64748B] hover:text-[#0E1726] rounded-[4px] cursor-pointer"
              title={showTable ? 'View Chart' : 'View Data Table'}
              aria-label={showTable ? 'Switch to chart view' : 'Switch to data table view'}
            >
              {showTable ? <BarChart2 className="w-4 h-4" /> : <Table className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full min-h-[160px] flex items-center justify-center">
        {empty ? (
          <div className="text-xs text-[#64748B] py-8 text-center">{emptyMessage}</div>
        ) : showTable && dataTable ? (
          <div className="w-full max-h-72 overflow-y-auto">{dataTable}</div>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </div>
    </div>
  );
};
