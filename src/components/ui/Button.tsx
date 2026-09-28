import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-[#0D5C4D] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer whitespace-nowrap';

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-xs gap-1.5 min-w-[32px]',
    md: 'h-9 px-3.5 text-sm gap-2 min-w-[36px]',
    lg: 'h-11 px-5 text-sm gap-2.5 min-w-[44px]'
  }[size];

  const variantClasses = {
    primary: 'bg-[#0D5C4D] hover:bg-[#094539] text-white border border-[#0D5C4D] shadow-none',
    secondary: 'bg-white hover:bg-[#F7F8FA] text-[#0E1726] border border-[#E4E7EC] hover:border-[#CBD2DC]',
    ghost: 'bg-transparent hover:bg-[#F7F8FA] text-[#334155] hover:text-[#0E1726]',
    danger: 'bg-white hover:bg-[#FEF3F2] text-[#B42318] border border-[#FDA29B]'
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      {children}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  variant = 'ghost',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-11 h-11 p-2.5'
  }[size];

  const variantClasses = {
    secondary: 'bg-white hover:bg-[#F7F8FA] text-[#334155] hover:text-[#0E1726] border border-[#E4E7EC]',
    ghost: 'bg-transparent hover:bg-[#F7F8FA] text-[#64748B] hover:text-[#0E1726]',
    danger: 'bg-white hover:bg-[#FEF3F2] text-[#B42318] border border-[#FDA29B]'
  }[variant];

  return (
    <button
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-[#0D5C4D] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
