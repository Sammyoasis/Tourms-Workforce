import React from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#0F1F1C] tracking-wide">
            {label}
            {props.required && <span className="text-[#C53030] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-[#3A4B47] pointer-events-none shrink-0">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded bg-white text-[#0F1F1C] border text-sm transition-colors min-h-[44px] px-3.5 placeholder:text-[#5A6E68] focus:outline-none focus:ring-2 focus:ring-[#0E5A46] focus:border-[#0E5A46] disabled:bg-[#EBEBDD] disabled:text-[#7A8B86] ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error ? 'border-[#C53030] ring-1 ring-[#C53030]' : 'border-[#C4C8C5]'
            } ${className}`}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#3A4B47] pointer-events-none shrink-0">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-[#C53030] font-medium mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-[#5A6E68] mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#0F1F1C] tracking-wide">
            {label}
            {props.required && <span className="text-[#C53030] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={`w-full rounded bg-white text-[#0F1F1C] border text-sm transition-colors p-3 placeholder:text-[#5A6E68] focus:outline-none focus:ring-2 focus:ring-[#0E5A46] focus:border-[#0E5A46] disabled:bg-[#EBEBDD] disabled:text-[#7A8B86] ${
            error ? 'border-[#C53030] ring-1 ring-[#C53030]' : 'border-[#C4C8C5]'
          } ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-[#C53030] font-medium mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-[#5A6E68] mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = 'Search by role, skill, or keyword...',
  className = '',
  value,
  onChange,
  onClear,
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 h-4 w-4 text-[#3A4B47] pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 min-h-[44px] bg-white border border-[#C4C8C5] rounded text-sm text-[#0F1F1C] placeholder:text-[#5A6E68] focus:outline-none focus:ring-2 focus:ring-[#0E5A46] focus:border-[#0E5A46]"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 text-xs text-[#5A6E68] hover:text-[#0F1F1C] p-1 cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
};
