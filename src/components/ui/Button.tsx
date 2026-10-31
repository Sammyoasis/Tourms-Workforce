import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors select-none rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0';

  const sizeClasses = {
    sm: 'text-xs px-3 py-2 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]', // >= 44px touch target
    lg: 'text-base px-6 py-3 min-h-[48px]'
  };

  const variantClasses = {
    primary:
      'bg-[#0E5A46] text-white hover:bg-[#0A4535] active:bg-[#073327] focus-visible:outline-[#0E5A46]',
    secondary:
      'bg-[#0F1F1C] text-white hover:bg-[#1A312D] active:bg-[#081210] focus-visible:outline-[#0F1F1C]',
    outline:
      'border border-[#0E5A46] text-[#0E5A46] bg-transparent hover:bg-[#0E5A46]/10 active:bg-[#0E5A46]/20 focus-visible:outline-[#0E5A46]',
    tertiary:
      'text-[#0E5A46] hover:text-[#0A4535] hover:bg-[#0E5A46]/10 active:bg-[#0E5A46]/20 bg-transparent focus-visible:outline-[#0E5A46]',
    destructive:
      'bg-[#C53030] text-white hover:bg-[#9B2C2C] active:bg-[#742A2A] focus-visible:outline-[#C53030]'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      )}
    </button>
  );
};
