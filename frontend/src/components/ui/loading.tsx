import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  subtext?: string;
  className?: string;
  textClassName?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2', 
  lg: 'h-8 w-8 border-2'
};

export function Loading({ 
  size = 'md', 
  text, 
  subtext, 
  className,
  textClassName 
}: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* Consistent spinner design matching style guide */}
      <div className="relative mb-3">
        {/* Main spinner */}
        <div className={cn(
          "rounded-full border-gray-200 border-t-blue-500 animate-spin",
          sizeClasses[size]
        )} />
        {/* Secondary counter-rotating ring for visual appeal */}
        <div className={cn(
          "absolute inset-0 rounded-full border-transparent border-t-cyan-400 animate-spin opacity-60",
          sizeClasses[size]
        )} 
        style={{ 
          animationDirection: 'reverse', 
          animationDuration: '1.5s' 
        }} />
      </div>
      
      {text && (
        <p className={cn("text-gray-600 font-medium text-sm", textClassName)}>
          {text}
        </p>
      )}
      
      {subtext && (
        <p className="text-xs text-gray-500 mt-1">
          {subtext}
        </p>
      )}
    </div>
  );
}

// Specific loading variants for common use cases
export function ChatLoading() {
  return <Loading text="Loading chat…" />;
}

export function CodeEditorLoading() {
  return (
    <Loading 
      size="lg" 
      text="Loading code editor..." 
      subtext="Preparing your development environment"
    />
  );
}

export function FileLoading() {
  return <Loading size="lg" />;
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={cn(
      "rounded-full border-white border-t-transparent animate-spin",
      sizeClasses[size]
    )} />
  );
}

export function ChatListSkeleton() {
  // Use fixed widths to avoid hydration mismatch
  const widths = ['75%', '85%', '65%', '80%', '70%', '90%'];
  
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-2 rounded-md p-2.5 border-l-2 border-transparent">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse flex-shrink-0" />
          <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" style={{ width: widths[i] }} />
          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </>
  );
}