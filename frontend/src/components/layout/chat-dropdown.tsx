'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MessageSquare, Plus, X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createChat, fetchChats, deleteChat } from '@/lib/api';
import { useToast } from '@/components/ui/toast';
import { useUI } from '@/context/ui-context';
import type { Chat } from '@/lib/types';

interface ChatDropdownProps {
  className?: string;
}

export function ChatDropdown({ className = '' }: ChatDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { show } = useToast();
  const { state, setCurrentChat } = useUI();
  const { currentChat } = state;

  // Load chats when dropdown is opened
  useEffect(() => {
    if (showDropdown && chats.length === 0) {
      loadChats();
    }
  }, [showDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadChats = async () => {
    setLoadingChats(true);
    try {
      const chatData = await fetchChats();
      setChats(chatData);
    } catch (error) {
      console.error('Failed to load chats:', error);
      show({ title: 'Failed to load chats', variant: 'error' });
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
      setShowDropdown(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to create chat:', error);
      show({ title: 'Failed to create chat', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    router.push(`/chat/${chat.id}`);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If we deleted the current chat, clear it
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
        router.push('/');
      }
      
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

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 hover:border-gray-300 transition-all duration-150 min-w-[200px] max-w-[300px] h-9 focus:outline-none shadow-sm active:scale-95"
      >
        <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span className="truncate flex-1 text-left">
          {currentChat?.title || 'Select Chat'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-150 flex-shrink-0 ${
          showDropdown ? 'rotate-180' : ''
        }`} />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden z-50">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 focus:border-cyan-400 transition-all duration-150 h-9"
              />
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={handleNewChat}
              disabled={loading}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg transition-all duration-150 focus:outline-none active:scale-95 h-9 font-medium ${
                loading 
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
                  : 'text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 hover:text-cyan-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Creating...' : 'New Chat'}
            </button>
          </div>

          {/* Chat List */}
          <div className="max-h-64 overflow-y-auto">
            {loadingChats ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading chats...</div>
            ) : filteredChats.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchQuery ? 'No chats found' : 'No chats yet'}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between px-2 py-2 mx-2 mb-1 rounded-md hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {chat.title || 'Untitled Chat'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRelativeTime(chat.updated_at || chat.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-md hover:bg-red-100 active:bg-red-200 transition-all duration-150 ml-2 flex items-center justify-center focus:outline-none active:scale-95"
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
    </div>
  );
}