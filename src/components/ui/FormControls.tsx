import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeValue,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center min-w-[240px] flex-1 ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-[#64748B] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 text-sm text-[#0E1726] bg-white border border-[#E4E7EC] hover:border-[#CBD2DC] focus:border-[#0D5C4D] rounded-[6px] transition-colors placeholder:text-[#94A3B8]"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChangeValue('')}
          className="absolute right-2.5 p-0.5 text-[#94A3B8] hover:text-[#0E1726] rounded-[4px] cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="inline-flex flex-col">
      {label && <label className="text-xs font-medium text-[#64748B] mb-1">{label}</label>}
      <div className="relative inline-block">
        <select
          className={`h-9 pl-3 pr-8 text-sm text-[#0E1726] bg-white border border-[#E4E7EC] hover:border-[#CBD2DC] focus:border-[#0D5C4D] rounded-[6px] transition-colors appearance-none cursor-pointer min-w-[140px] ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#334155]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full h-9 px-3 text-sm text-[#0E1726] bg-white border rounded-[6px] transition-colors placeholder:text-[#94A3B8] ${
          error ? 'border-[#FDA29B] focus:border-[#B42318]' : 'border-[#E4E7EC] hover:border-[#CBD2DC] focus:border-[#0D5C4D]'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#B42318]">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#64748B]">{helperText}</span>}
    </div>
  );
};

export const FilterBar: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 w-full bg-white p-2.5 rounded-[8px] border border-[#E4E7EC] ${className}`}>
      {children}
    </div>
  );
};
