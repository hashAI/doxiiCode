'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface MobileBottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  defaultState?: 'collapsed' | 'partial' | 'full';
  onStateChange?: (state: 'collapsed' | 'partial' | 'full') => void;
  chatName?: string;
}

export function MobileBottomSheet({ 
  children, 
  isOpen, 
  onClose, 
  defaultState = 'collapsed',
  onStateChange,
  chatName
}: MobileBottomSheetProps) {
  const [sheetState, setSheetState] = useState<'collapsed' | 'partial' | 'full'>(defaultState);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Height calculations
  const getSheetHeight = () => {
    switch (sheetState) {
      case 'collapsed': return '120px'; // Input area with proper spacing
      case 'partial': return '45vh';    // 45% of screen
      case 'full': return '85vh';       // 85% of screen
      default: return '120px';
    }
  };

  const getSheetTransform = () => {
    if (!isDragging) return 'translateY(0)';
    const maxHeight = window.innerHeight * 0.8;
    const dragOffset = Math.min(Math.max(currentY - startY, -maxHeight), 200);
    return `translateY(${dragOffset}px)`;
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    const threshold = 50; // Minimum drag distance to trigger state change
    
    if (deltaY > threshold) {
      // Dragging down
      if (sheetState === 'full') {
        setSheetState('partial');
      } else if (sheetState === 'partial') {
        setSheetState('collapsed');
      }
    } else if (deltaY < -threshold) {
      // Dragging up
      if (sheetState === 'collapsed') {
        setSheetState('partial');
      } else if (sheetState === 'partial') {
        setSheetState('full');
      }
    }
    
    setIsDragging(false);
  };

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    const threshold = 50;
    
    if (deltaY > threshold) {
      if (sheetState === 'full') {
        setSheetState('partial');
      } else if (sheetState === 'partial') {
        setSheetState('collapsed');
      }
    } else if (deltaY < -threshold) {
      if (sheetState === 'collapsed') {
        setSheetState('partial');
      } else if (sheetState === 'partial') {
        setSheetState('full');
      }
    }
    
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, currentY, startY, sheetState]);

  useEffect(() => {
    onStateChange?.(sheetState);
  }, [sheetState, onStateChange]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - only visible when partial or full */}
      {(sheetState === 'partial' || sheetState === 'full') && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setSheetState('collapsed')}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 md:hidden transition-all duration-300 ease-out"
        style={{
          height: getSheetHeight(),
          transform: getSheetTransform(),
          paddingBottom: `env(safe-area-inset-bottom, 0px)`
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex items-center justify-center py-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header with state controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (sheetState === 'collapsed') {
                  setSheetState('partial');
                } else if (sheetState === 'partial') {
                  setSheetState('full');
                } else {
                  setSheetState('collapsed');
                }
              }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
              title={
                sheetState === 'collapsed' ? 'Expand to partial view' :
                sheetState === 'partial' ? 'Expand to full view' :
                'Collapse'
              }
            >
              {sheetState === 'collapsed' && <ChevronUp className="h-4 w-4 text-gray-600" />}
              {sheetState === 'partial' && <ChevronUp className="h-4 w-4 text-blue-600" />}
              {sheetState === 'full' && <ChevronDown className="h-4 w-4 text-blue-600" />}
            </button>
          </div>
          
          <div className="text-sm text-gray-600 font-medium flex-1 text-center">
            {sheetState === 'collapsed' && (chatName || 'Chat')}
            {sheetState === 'partial' && (chatName || 'Conversation')}
            {sheetState === 'full' && (chatName || 'Full Chat')}
          </div>
          
          {(sheetState === 'partial' || sheetState === 'full') && (
            <button
              onClick={() => setSheetState('collapsed')}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors active:scale-95"
              title="Collapse"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
}