import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { BookingStatus, PaymentStatus } from '../../lib/repository/types';
import { Money } from './Typography';

interface StatusBadgeProps {
  status: BookingStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const norm = status || 'Confirmed';

  let style = 'bg-[#F7F8FA] text-[#334155] border border-[#E4E7EC]';
  if (norm === 'Checked In') {
    style = 'bg-[#EAF4F1] text-[#0D5C4D] border border-[#D1E8E2] font-medium';
  } else if (norm === 'Completed') {
    style = 'bg-transparent text-[#64748B]';
  } else if (norm === 'Cancelled') {
    style = 'bg-[#FEF3F2] text-[#B42318] border border-[#FDA29B]';
  }

  return (
    <span
      className={`inline-flex items-center px-1.5 h-5 text-xs font-medium rounded-[4px] leading-none whitespace-nowrap select-none ${style} ${className}`}
    >
      {norm}
    </span>
  );
};

interface PaymentBadgeProps {
  status: PaymentStatus | string;
  balanceDue?: number;
  className?: string;
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({
  status,
  balanceDue,
  className = '',
}) => {
  const norm = status || 'Unpaid';

  if (norm === 'Paid' || (balanceDue !== undefined && balanceDue <= 0)) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-[#64748B] font-medium whitespace-nowrap select-none ${className}`}>
        <Check className="w-3.5 h-3.5 text-[#067647]" strokeWidth={2.5} />
        <span>Paid</span>
      </span>
    );
  }

  if (norm === 'Partially Paid') {
    return (
      <span
        className={`inline-flex items-center px-1.5 h-5 text-xs font-medium rounded-[4px] leading-none whitespace-nowrap select-none bg-[#FEF3C7] text-[#B45309] border border-[#F5D58A] ${className}`}
      >
        Partially Paid
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-1.5 h-5 text-xs font-medium rounded-[4px] leading-none whitespace-nowrap select-none bg-[#FEF3F2] text-[#B42318] border border-[#FDA29B] ${className}`}
    >
      Unpaid
    </span>
  );
};

interface BalanceCellProps {
  balanceDue: number;
  paymentStatus?: string;
  className?: string;
}

export const BalanceCell: React.FC<BalanceCellProps> = ({
  balanceDue,
  className = '',
}) => {
  if (balanceDue <= 0) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-[#64748B] font-medium tabular-nums ${className}`}>
        <Check className="w-3.5 h-3.5 text-[#067647]" strokeWidth={2.5} />
        <span>Paid</span>
      </span>
    );
  }

  const isFullDue = balanceDue > 10000;
  const textColor = isFullDue ? 'text-[#B42318]' : 'text-[#B45309]';

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${textColor} ${className}`}>
      <AlertCircle className="w-3.5 h-3.5" />
      <span>
        <Money amount={balanceDue} /> due
      </span>
    </span>
  );
};

interface ScopeChipProps {
  label: string;
  className?: string;
}

export const ScopeChip: React.FC<ScopeChipProps> = ({ label, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium text-[#334155] bg-[#F7F8FA] border border-[#E4E7EC] rounded-[4px] whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
};
