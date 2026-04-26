'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Settings, LogOut, Sparkles, Menu, Home, MessageSquare, Plus, X, ChevronRight, FileText, RotateCw, Monitor, Smartphone, Play, Edit3, Save, RotateCcw, Maximize, Minimize, Tablet, Package } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { createChat, fetchChats, deleteChat } from '@/lib/api';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/toast';
import { useUI } from '@/context/ui-context';
import { ChatDropdown } from './chat-dropdown';
import { ModeToggle } from './mode-toggle';
import type { Chat } from '@/lib/types';

export function UnifiedHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { show } = useToast();
  const { state, setCurrentChat } = useUI();

  const isHome = pathname === '/';
  const isChat = pathname.startsWith('/chat');
  const isEditor = pathname.startsWith('/editor');
  const isComponentLibrary = pathname.startsWith('/components-library');



  // Load chats when component mounts on mobile
  useEffect(() => {
    if (isMobile) {
      loadChats();
    }
  }, [isMobile]);

  const loadChats = async () => {
    setLoadingChats(true);
    try {
      const chatData = await fetchChats();
      setChats(chatData);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleNewChat = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newChat = await createChat('New Chat');
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
      show({ title: 'Failed to create chat', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
    router.push(`/chat/${chatId}`);
    setMobileMenuOpen(false);
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      show({ title: 'Chat deleted successfully' });
    } catch (error) {
      console.error('Failed to delete chat:', error);
      show({ title: 'Failed to delete chat', variant: 'error' });
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Preview UI state mirrored in header for active styles
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [visualEdit, setVisualEdit] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [editableRoute, setEditableRoute] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ viewportSize?: 'desktop' | 'mobile' | 'tablet'; visualEditMode?: boolean; currentRoute?: string; isFullscreen?: boolean }>;
      if (ce.detail?.viewportSize) setPreviewViewport(ce.detail.viewportSize);
      if (typeof ce.detail?.visualEditMode === 'boolean') setVisualEdit(!!ce.detail.visualEditMode);
      if (typeof ce.detail?.isFullscreen === 'boolean') setIsFullscreen(ce.detail.isFullscreen);
      if (typeof ce.detail?.currentRoute === 'string') {
        setCurrentRoute(ce.detail.currentRoute);
        if (!isEditingRoute) setEditableRoute(ce.detail.currentRoute);
      }
    };
    window.addEventListener('preview-state-change', handler as EventListener);
    return () => window.removeEventListener('preview-state-change', handler as EventListener);
  }, [isEditingRoute]);

  const dispatchPreviewEvent = (type: string, detail?: any) => {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  };

  const handleRouteNavigation = (route: string) => {
    const cleanRoute = route.trim();
    const normalizedRoute = cleanRoute.startsWith('/') ? cleanRoute : `/${cleanRoute}`;
    dispatchPreviewEvent('preview-navigate', { route: normalizedRoute });
  };

  const startEditingRoute = () => {
    setIsEditingRoute(true);
    setEditableRoute(currentRoute);
  };

  const cancelEditingRoute = () => {
    setIsEditingRoute(false);
    setEditableRoute(currentRoute);
  };

  const confirmRouteEdit = () => {
    const newRoute = editableRoute.trim() || '/';
    handleRouteNavigation(newRoute);
    setIsEditingRoute(false);
  };

  const dispatchModeChange = (mode: 'code' | 'preview') => {
    window.dispatchEvent(new CustomEvent('mode-change', { detail: { mode } }));
  };

  const renderModeSpecificControls = () => {
    // Code mode controls: show selected file info + reset/save buttons
    if (isEditor || (isChat && state.currentMode === 'code')) {
      return (
        <div className="flex items-center gap-3">
          {state.selectedFile && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg h-9">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="truncate max-w-32 font-medium">
                {state.selectedFile.split('/').pop() || 'No file selected'}
              </span>
            </div>
          )}
          {state.selectedFile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatchPreviewEvent('code-editor-reset')}
                className="h-9 px-3 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-600 hover:text-gray-800 active:scale-95 flex items-center justify-center transition-all duration-150 focus:outline-none shadow-sm border border-gray-200 hover:border-gray-300"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => dispatchPreviewEvent('code-editor-save')}
                className="h-9 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 active:from-cyan-700 active:to-blue-700 text-white active:scale-95 flex items-center justify-center transition-all duration-150 focus:outline-none shadow-sm"
                title="Save"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      );
    }
    
    // Preview mode controls: Build, Refresh, Viewport, Visual Edit + Current Route
    if ((isEditor || isChat) && state.currentMode === 'preview') {
      return (
        <div className="flex items-center gap-3">
          {/* Current Route Display - Editable */}
          {currentRoute && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg max-w-56 h-9">
              <span className="text-gray-500 text-sm">🌐</span>
              {isEditingRoute ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="text"
                    value={editableRoute}
                    onChange={(e) => setEditableRoute(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        confirmRouteEdit();
                      } else if (e.key === 'Escape') {
                        cancelEditingRoute();
                      }
                    }}
                    onBlur={cancelEditingRoute}
                    className="flex-1 bg-white rounded px-2 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 border border-gray-200 focus:border-cyan-400 transition-all duration-150 min-w-0"
                    placeholder="/route"
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  onClick={startEditingRoute}
                  className="flex items-center gap-1 flex-1 min-w-0 text-left hover:bg-gray-200 rounded px-2 py-1 transition-all duration-150 group focus:outline-none"
                  title="Click to edit route"
                >
                  <span className="truncate font-mono text-xs text-gray-700 font-medium">
                    {currentRoute.startsWith('/') ? currentRoute : `/${currentRoute}`}
                  </span>
                  <span className="opacity-0 group-hover:opacity-70 text-gray-500 text-xs ml-1">✎</span>
                </button>
              )}
            </div>
          )}
          <button
            onClick={() => dispatchPreviewEvent('preview-refresh')}
            className="gap-2 px-3 py-2 text-sm rounded-lg flex items-center justify-center transition-all duration-150 focus:outline-none shadow-sm h-9 font-medium active:scale-95 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300"
            title="Refresh Preview"
          >
            <RotateCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => { const next = !visualEdit; setVisualEdit(next); dispatchPreviewEvent('preview-toggle-edit', { enabled: next }); }}
            className={`gap-2 px-3 py-2 text-sm rounded-lg flex items-center justify-center transition-all duration-150 focus:outline-none shadow-sm h-9 font-medium active:scale-95 ${
              visualEdit 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 active:from-cyan-700 active:to-blue-700 text-white' 
                : 'bg-white hover:bg-cyan-50 active:bg-cyan-100 text-gray-700 hover:text-cyan-600 active:text-cyan-700 border border-gray-200 hover:border-cyan-300'
            }`}
            title="Toggle Visual Edit"
          >
            <Edit3 className="h-4 w-4" />
            Visual Edit
          </button>
          <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-1 h-9">
            <button
              onClick={() => { setPreviewViewport('desktop'); dispatchPreviewEvent('preview-set-viewport', { size: 'desktop' }); }}
              className={`gap-1 px-2 py-1.5 text-sm rounded-md flex items-center justify-center transition-all duration-150 focus:outline-none ${
                previewViewport === 'desktop' 
                  ? 'bg-white text-cyan-600 shadow-sm font-medium' 
                  : 'hover:bg-white hover:bg-opacity-50 text-gray-600 hover:text-gray-800'
              }`}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setPreviewViewport('tablet'); dispatchPreviewEvent('preview-set-viewport', { size: 'tablet' }); }}
              className={`gap-1 px-2 py-1.5 text-sm rounded-md flex items-center justify-center transition-all duration-150 focus:outline-none ${
                previewViewport === 'tablet' 
                  ? 'bg-white text-cyan-600 shadow-sm font-medium' 
                  : 'hover:bg-white hover:bg-opacity-50 text-gray-600 hover:text-gray-800'
              }`}
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setPreviewViewport('mobile'); dispatchPreviewEvent('preview-set-viewport', { size: 'mobile' }); }}
              className={`gap-1 px-2 py-1.5 text-sm rounded-md flex items-center justify-center transition-all duration-150 focus:outline-none ${
                previewViewport === 'mobile' 
                  ? 'bg-white text-cyan-600 shadow-sm font-medium' 
                  : 'hover:bg-white hover:bg-opacity-50 text-gray-600 hover:text-gray-800'
              }`}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => { 
              const nextFullscreen = !isFullscreen;
              setIsFullscreen(nextFullscreen); 
              dispatchPreviewEvent('preview-fullscreen', { enabled: nextFullscreen }); 
            }}
            className={`gap-2 px-3 py-2 text-sm rounded-lg flex items-center justify-center transition-all duration-150 focus:outline-none shadow-sm h-9 font-medium active:scale-95 ${
              isFullscreen 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 active:from-purple-700 active:to-indigo-700 text-white' 
                : 'bg-white hover:bg-purple-50 active:bg-purple-100 text-gray-700 hover:text-purple-600 active:text-purple-700 border border-gray-200 hover:border-purple-300'
            }`}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            {isFullscreen ? 'Exit' : 'Full'}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 relative z-50">
      {/* Left Section: Mobile Menu + Logo + Chat Dropdown + Mode Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Burger Menu */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="h-9 w-9 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-600 hover:text-gray-800 active:scale-95 flex items-center justify-center transition-all duration-150 focus:outline-none shadow-sm border border-gray-200 hover:border-gray-300"
                title="Menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px] bg-gray-50">
              <div className="flex flex-col h-full">
                {/* Elegant Header */}
                <div className="p-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <SheetTitle className="text-xl font-bold text-white">Doxii</SheetTitle>
                      <p className="text-sm text-white/90 mt-0.5">Design. Build. Share.</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Menu Items */}
                <div className="flex-1 p-6">
                  <nav className="space-y-3">
                    <button
                      onClick={() => {
                        router.push('/');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 focus:outline-none ${
                        isHome
                          ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Home className={`h-4 w-4 ${isHome ? 'text-cyan-600' : 'text-gray-500'}`} />
                      <span className="font-medium text-sm">Home</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowRecentChats(!showRecentChats);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 focus:outline-none ${
                        isChat && !isHome
                          ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <MessageSquare className={`h-4 w-4 ${isChat && !isHome ? 'text-cyan-600' : 'text-gray-500'}`} />
                      <span className="font-medium text-sm flex-1">Recent Chats</span>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${showRecentChats ? 'rotate-90' : ''} ${isChat && !isHome ? 'text-cyan-600' : 'text-gray-500'}`} />
                    </button>

                    {/* Expandable Chat List */}
                    {showRecentChats && (
                      <div className="ml-7 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                          {loadingChats ? (
                            <div className="py-2 text-sm text-gray-500">Loading chats...</div>
                          ) : chats.length === 0 ? (
                            <div className="py-2 text-sm text-gray-500">No chats yet</div>
                          ) : (
                            chats.map((chat) => (
                              <div
                                key={chat.id}
                                className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-gray-50 transition-colors duration-200 group"
                              >
                                <button
                                  onClick={() => handleChatClick(chat.id)}
                                  className="flex-1 min-w-0 text-left px-2 py-1 rounded transition-all duration-150 hover:bg-gray-100 focus:outline-none"
                                >
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {chat.title || 'Untitled Chat'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {formatRelativeTime(chat.updated_at || chat.created_at)}
                                  </div>
                                </button>
                                <button
                                  onClick={(e) => handleDeleteChat(chat.id, e)}
                                  className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-md hover:bg-red-100 active:bg-red-200 transition-all duration-150 flex items-center justify-center focus:outline-none"
                                  title="Delete chat"
                                >
                                  <X className="h-3 w-3 text-red-500" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        if (!loading) {
                          await handleNewChat();
                          setMobileMenuOpen(false);
                        }
                      }}
                      disabled={loading}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 focus:outline-none ${
                        loading 
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700'
                      }`}
                    >
                      <Plus className={`h-4 w-4 ${loading ? 'text-gray-400' : 'text-gray-500 group-hover:text-purple-600'}`} />
                      <span className="font-medium text-sm">
                        {loading ? 'Creating...' : 'New Chat'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/components-library');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 focus:outline-none ${
                        isComponentLibrary
                          ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Package className={`h-4 w-4 ${isComponentLibrary ? 'text-cyan-600' : 'text-gray-500'}`} />
                      <span className="font-medium text-sm">Component Library</span>
                    </button>
                  </nav>
                </div>

                {/* Elegant Footer */}
                <div className="p-6 bg-white border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-sm font-medium">Made with ❤️</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            Doxii
          </h1>
        </div>

        {/* Desktop: Component Library Link */}
        {!isMobile && !isComponentLibrary && (
          <button
            onClick={() => router.push('/components-library')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 transition-all duration-150 focus:outline-none h-9"
          >
            <Package className="h-4 w-4" />
            Components
          </button>
        )}

        {/* Desktop: Chat Dropdown */}
        {!isMobile && (isChat || isEditor) && (
          <ChatDropdown />
        )}

        {/* Mode Toggle - show for editor and chat pages */}
        {!isMobile && (isChat || isEditor) && (
          <ModeToggle />
        )}

        {/* Mode-specific Controls */}
        <div className="flex items-center">
          {!isMobile && renderModeSpecificControls()}
        </div>
      </div>

      {/* Right Section: User Profile */}
      <div className="relative">
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 active:from-cyan-100 active:to-blue-100 transition-all duration-150 group focus:outline-none h-9"
        >
          <div className="h-6 w-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <User className="h-3 w-3 text-white" />
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-all duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg py-2 shadow-lg">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">User Account</p>
              <p className="text-xs text-gray-500 mt-0.5">user@example.com</p>
            </div>
            
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 transition-all duration-150 focus:outline-none">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-150 focus:outline-none">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}