'use client';

import React from 'react';
import { Code2, Eye } from 'lucide-react';
import { useUI, type ViewMode } from '@/context/ui-context';

interface ModeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ModeToggle({ className = '', size = 'md' }: ModeToggleProps) {
  const { state, setMode } = useUI();
  const { currentMode } = state;

  const handleModeChange = (mode: 'code' | 'preview') => {
    setMode(mode);
    // Dispatch event for chat page to listen to
    window.dispatchEvent(new CustomEvent('mode-change', { detail: { mode } }));
  };

  const isSmall = size === 'sm';
  const buttonSize = isSmall ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs';
  const iconSize = isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <div className={`flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-1 h-9 ${className}`}>
      <button
        onClick={() => handleModeChange('code')}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 focus:outline-none active:scale-95 ${
          currentMode === 'code'
            ? 'bg-white text-cyan-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50'
        }`}
        title="Code Editor Mode"
      >
        <Code2 className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => handleModeChange('preview')}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 focus:outline-none active:scale-95 ${
          currentMode === 'preview'
            ? 'bg-white text-cyan-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50'
        }`}
        title="Preview Mode"
      >
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );
}