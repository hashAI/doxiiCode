'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Chat } from '@/lib/types';

export type ViewMode = 'code' | 'preview';

interface UIState {
  currentMode: ViewMode;
  currentChat: Chat | null;
  isMobile: boolean;
  sidebarCollapsed: boolean;
  selectedFile: string | null;
}

type UIAction =
  | { type: 'SET_MODE'; payload: ViewMode }
  | { type: 'SET_CURRENT_CHAT'; payload: Chat | null }
  | { type: 'SET_IS_MOBILE'; payload: boolean }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_SELECTED_FILE'; payload: string | null };

interface UIContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
  // Convenience methods
  setMode: (mode: ViewMode) => void;
  setCurrentChat: (chat: Chat | null) => void;
  setIsMobile: (isMobile: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedFile: (file: string | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const initialState: UIState = {
  currentMode: 'preview',
  currentChat: null,
  isMobile: false,
  sidebarCollapsed: false,
  selectedFile: null,
};

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, currentMode: action.payload };
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload };
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    case 'SET_SELECTED_FILE':
      return { ...state, selectedFile: action.payload };
    default:
      return state;
  }
}

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const contextValue: UIContextType = {
    state,
    dispatch,
    setMode: (mode: ViewMode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setCurrentChat: (chat: Chat | null) => dispatch({ type: 'SET_CURRENT_CHAT', payload: chat }),
    setIsMobile: (isMobile: boolean) => dispatch({ type: 'SET_IS_MOBILE', payload: isMobile }),
    setSidebarCollapsed: (collapsed: boolean) => dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed }),
    setSelectedFile: (file: string | null) => dispatch({ type: 'SET_SELECTED_FILE', payload: file }),
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}