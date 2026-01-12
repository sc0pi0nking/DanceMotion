import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
  children: React.ReactNode;
}

const baseClass = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-bg hover:shadow-lg hover:scale-105 active:scale-95 dark:hover:shadow-accent/50',
  secondary: 'bg-panel border-2 border-border text-fg hover:border-accent hover:bg-accent/5 active:scale-95',
  ghost: 'text-accent hover:bg-accent/10 active:bg-accent/20',
  danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg active:scale-95 dark:hover:shadow-red-500/50',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = 'primary', size = 'md', href, children, className, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

LinkButton.displayName = 'LinkButton';
