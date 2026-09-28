import React from 'react';
import { ScopeChip } from './Badges';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  scopeLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  scopeLabel,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 ${className}`}>
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#0E1726] tracking-tight leading-tight">
          {title}
        </h1>
        {(subtitle || scopeLabel) && (
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-[#64748B]">
            {scopeLabel && <ScopeChip label={scopeLabel} />}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
