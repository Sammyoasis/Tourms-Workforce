import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded border border-[#C4C8C5] bg-white ${className}`}
    >
      {icon && <div className="text-[#5A6E68] mb-3">{icon}</div>}
      <h3 className="text-base font-bold text-[#0F1F1C]">{title}</h3>
      <p className="text-sm text-[#5A6E68] max-w-md mt-1.5 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const LoadingSkeletonCard: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full" aria-busy="true" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white border border-[#C4C8C5] rounded space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-[#EBEBDD] rounded w-1/3"></div>
            <div className="h-4 bg-[#EBEBDD] rounded w-20"></div>
          </div>
          <div className="h-3 bg-[#EBEBDD] rounded w-1/2"></div>
          <div className="h-3 bg-[#EBEBDD] rounded w-5/6"></div>
          <div className="pt-2 flex items-center gap-3">
            <div className="h-3 bg-[#EBEBDD] rounded w-24"></div>
            <div className="h-3 bg-[#EBEBDD] rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const LoadingSkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white border border-[#C4C8C5] rounded overflow-hidden animate-pulse">
      <div className="h-10 bg-[#EBEBDD] border-b border-[#C4C8C5]"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-12 border-b border-[#EBEBDD] px-4 flex items-center justify-between gap-4"
        >
          <div className="h-4 bg-[#EBEBDD] rounded w-1/4"></div>
          <div className="h-4 bg-[#EBEBDD] rounded w-1/6"></div>
          <div className="h-4 bg-[#EBEBDD] rounded w-1/6"></div>
          <div className="h-4 bg-[#EBEBDD] rounded w-16"></div>
        </div>
      ))}
    </div>
  );
};
