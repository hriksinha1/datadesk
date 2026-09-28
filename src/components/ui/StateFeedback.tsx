import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-[#E4E7EC] rounded-[8px] ${className}`}
    >
      {icon && <div className="mb-3 text-[#64748B]">{icon}</div>}
      <h3 className="text-base font-semibold text-[#0E1726]">{title}</h3>
      {description && <p className="mt-1 text-sm text-[#64748B] max-w-md">{description}</p>}
      {action && (
        <div className="mt-4">
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  technicalError?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Couldn't load data",
  message = 'A temporary issue occurred while loading this section. Please try again.',
  technicalError,
  onRetry,
  className = '',
}) => {
  const [showTech, setShowTech] = useState(false);

  return (
    <div
      className={`p-6 sm:p-8 bg-white border border-[#FDA29B] rounded-[8px] flex flex-col items-center text-center max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#FEF3F2] flex items-center justify-center text-[#B42318] mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-base font-semibold text-[#0E1726]">{title}</h3>
      <p className="mt-1 text-sm text-[#64748B]">{message}</p>

      {onRetry && (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}

      {technicalError && (
        <div className="mt-4 w-full text-left">
          <button
            type="button"
            onClick={() => setShowTech(!showTech)}
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0E1726] cursor-pointer"
          >
            <span>Technical details</span>
            {showTech ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showTech && (
            <pre className="mt-2 p-3 text-xs bg-[#F7F8FA] border border-[#E4E7EC] rounded-[4px] text-[#334155] overflow-x-auto whitespace-pre-wrap font-mono">
              {technicalError}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-[#E4E7EC]/60 animate-pulse rounded-[4px] @media(prefers-reduced-motion:reduce){animate-none} ${className}`}
    />
  );
};
