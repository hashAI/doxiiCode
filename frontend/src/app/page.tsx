'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUp,
  Bot,
  Clipboard,
  Figma,
  Globe,
  ImageIcon,
  Send,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { createChat, fetchChats } from '@/lib/api';
import { ButtonLoading } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { Preview } from '@/components/layout/preview';
import { Button } from '@/components/ui/button';
import type { Chat } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load chats on component mount
  useEffect(() => {
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

    loadChats();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;
    
    setLoading(true);
    try {
      // Create chat with a title (first 50 chars)
      const title = inputValue.slice(0, 50) + (inputValue.length > 50 ? '...' : '');
      const newChat = await createChat(title);
      
      // Redirect to chat page with message
      router.push(`/chat/${newChat.id}?message=${encodeURIComponent(inputValue)}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const examplePrompts = [
    { 
      icon: "📊", 
      title: "Social media dashboard", 
      description: "Build analytics and management tools"
    },
    { 
      icon: "🛒", 
      title: "E-commerce product page", 
      description: "Modern product showcase with cart"
    },
    { 
      icon: "📎", 
      title: "File uploader", 
      description: "Drag & drop file upload interface"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Build with{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Doxii
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Create beautiful React applications by chatting with AI
            </p>
          </div>

          {/* Main Input */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Doxii to create a application for my..."
                className="w-full resize-none border border-gray-200 rounded-2xl py-4 px-6 pr-20 text-base bg-white/90 backdrop-blur-sm placeholder:text-gray-400 min-h-[80px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 shadow-sm"
                rows={3}
                disabled={loading}
              />
              {/* Send Button */}
              <button 
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                {loading ? (
                  <ButtonLoading size="sm" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12 max-w-4xl mx-auto">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputValue(`Create a ${prompt.title.toLowerCase()}`)}
                className="flex items-center gap-3 p-4 text-left bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="font-medium text-gray-900 text-sm">{prompt.title}</div>
                  <div className="text-xs text-gray-500">{prompt.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Workspace</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors"
                />
              </div>
              <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 transition-colors">
                <option>Last edited</option>
                <option>Newest first</option>
                <option>Oldest first</option>
              </select>
              <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 transition-colors">
                <option>All creators</option>
              </select>
              <button className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                View All
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingChats ? (
              // Loading placeholders
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
              ))
            ) : filteredChats.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-2">No projects yet</div>
                <p className="text-sm text-gray-500">Start by creating your first project above</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  className="group bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-blue-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {chat.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {formatRelativeTime(chat.updated_at || chat.created_at)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    Click to continue working on this project
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
