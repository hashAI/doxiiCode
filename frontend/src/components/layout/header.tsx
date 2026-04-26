'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, Settings, LogOut, Sparkles, Menu, Home, MessageSquare, Plus, X, ChevronRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { createChat, fetchChats, deleteChat } from '@/lib/api';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/toast';
import type { Chat } from '@/lib/types';

export function Header() {
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

  const isHome = pathname === '/';
  const isChat = pathname.startsWith('/chat');

  // Load chats when component mounts
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
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatId: string) => {
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


  return (
    <header className="flex h-14 items-center justify-between border-b bg-white/80 backdrop-blur-sm px-6 relative z-50">
      {/* Left: Mobile Burger Menu + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Burger Menu */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Menu"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px] bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
              <div className="flex flex-col h-full">
                {/* Elegant Header */}
                <div className="p-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
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
                      className={`w-full flex items-center gap-3 py-2 text-left transition-colors duration-200 ${
                        isHome
                          ? 'text-blue-600'
                          : 'text-gray-900 hover:text-gray-700'
                      }`}
                    >
                      <Home className={`h-4 w-4 ${isHome ? 'text-blue-600' : 'text-gray-600'}`} />
                      <span className="font-medium text-sm">Home</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowRecentChats(!showRecentChats);
                      }}
                      className={`w-full flex items-center gap-3 py-2 text-left transition-colors duration-200 ${
                        isChat && !isHome
                          ? 'text-blue-600'
                          : 'text-gray-900 hover:text-gray-700'
                      }`}
                    >
                      <MessageSquare className={`h-4 w-4 ${isChat && !isHome ? 'text-blue-600' : 'text-gray-600'}`} />
                      <span className="font-medium text-sm flex-1">Recent Chats</span>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${showRecentChats ? 'rotate-90' : ''}`} />
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
                                  className="flex-1 min-w-0 text-left"
                                >
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {chat.title || 'Untitled Chat'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatRelativeTime(chat.updated_at || chat.created_at)}
                                  </div>
                                </button>
                                <button
                                  onClick={(e) => handleDeleteChat(chat.id, e)}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition-all duration-200"
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
                      className={`w-full flex items-center gap-3 py-2 text-left transition-colors duration-200 ${
                        loading 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-900 hover:text-gray-700'
                      }`}
                    >
                      <Plus className={`h-4 w-4 ${loading ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className="font-medium text-sm">
                        {loading ? 'Creating...' : 'New Chat'}
                      </span>
                    </button>
                  </nav>
                </div>

                {/* Elegant Footer */}
                <div className="p-6 bg-white/50 backdrop-blur-sm border-t border-white/20">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <div className="w-5 h-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded flex items-center justify-center">
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
          <div className="w-7 h-7 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800 bg-clip-text">
            Doxii
          </h1>
        </div>
      </div>

      {/* User Profile */}
      <div className="relative">
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group"
        >
          <div className="h-7 w-7 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-white" />
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-gray-600 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg py-1">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-900">User Account</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
            
            <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-colors duration-200">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </button>
            
            <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-colors duration-200">
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

