'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Plus, MessageSquare, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchChats, createChat, deleteChat } from '@/lib/api';
import type { Chat } from '@/lib/types';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract chat ID from pathname
  const currentChatId = pathname.startsWith('/chat/') ? pathname.split('/')[2] : null;

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const chatData = await fetchChats();
      setChats(chatData);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const handleNewChat = async () => {
    setLoading(true);
    try {
      const newChat = await createChat('New Chat');
      setChats(prev => [newChat, ...prev]);
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
    setLoading(false);
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      if (currentChatId === chatId) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <aside className="w-72 flex flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={handleHomeClick}
            className="text-lg font-semibold text-gray-800 hover:text-gray-600"
          >
            Doxii
          </button>
          <Button
            onClick={handleNewChat}
            disabled={loading}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 rounded-md p-2 cursor-pointer transition-colors ${
                  currentChatId === chat.id 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleChatClick(chat.id)}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 truncate text-sm">{chat.title}</span>
                {chat.file_count > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                    {chat.file_count}
                  </span>
                )}
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                >
                  <Trash2 className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            ))}
            
            {chats.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No chats yet</p>
                <p className="text-xs">Create your first chat to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

