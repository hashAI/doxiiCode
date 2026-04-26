'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Plus, MessageSquare, Trash2, Search, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { fetchChats, createChat, deleteChat, fetchChat } from '@/lib/api';
import { SSEService } from '@/lib/realtime';
import type { Chat, Message } from '@/lib/types';
import { ChatPanel } from '@/components/chat-panel';
import { ChatLoading, ChatListSkeleton } from '@/components/ui/loading';

export function ChatSidebar() {
  const router = useRouter();
  const { show } = useToast();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Current chat state
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingType, setStreamingType] = useState<string>('text');
  const [loadingChat, setLoadingChat] = useState(false);
  const [streamingMessages, setStreamingMessages] = useState<Message[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');
  const [streamingTimestamp, setStreamingTimestamp] = useState<number>(Date.now());
  const [filesSummary, setFilesSummary] = useState<any[]>([]);
  const [showImmediateAssistantBubble, setShowImmediateAssistantBubble] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const [rt, setRt] = useState<SSEService | null>(null);

  // Helper function to generate sequential timestamps for streaming messages
  const getNextStreamingTimestamp = () => {
    const timestamp = streamingTimestamp;
    setStreamingTimestamp(prev => prev + 10); // Increment by 10ms to maintain order
    return new Date(timestamp).toISOString();
  };


  // Extract chat ID from pathname
  const currentChatId = pathname.startsWith('/chat/') ? pathname.split('/')[2] : null;
  const isChatDetailPage = !!currentChatId;

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      loadChatDetails(currentChatId);
    }
  }, [currentChatId]);
  
  // SSE connection per current chat
  useEffect(() => {
    if (!currentChatId) return;
    const service = new SSEService(currentChatId);
    setRt(service);

    // AI stream events
    service.on('ai_stream', (data: any) => {
      const chunkType = data.chunk_type as string;
      const content = data.content as string;

      if (chunkType === 'files_summary') {
        setFilesSummary(Array.isArray(content) ? (content as any[]) : []);
        return;
      }
      if (chunkType === 'text') {
        setStreamingType('text');
        setStreamingMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.message_type === 'text') {
            const updated = [...prev];
            updated[updated.length - 1] = { ...last, content: last.content + (content || '') };
            return updated;
          }
          return [
            ...prev,
            {
              id: `streaming-text-${Date.now()}`,
              chat_id: currentChatId,
              content: content || '',
              role: 'assistant',
              message_type: 'text',
              timestamp: new Date().toISOString(),
            },
          ];
        });
        return;
      }
      if (chunkType === 'thinking') {
        setStreamingMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.message_type === 'thinking') {
            const updated = [...prev];
            updated[updated.length - 1] = { ...last, content: last.content + (content || '') };
            return updated;
          }
          return [
            ...prev,
            {
              id: `streaming-thinking-${Date.now()}`,
              chat_id: currentChatId,
              content: content || '',
              role: 'assistant',
              message_type: 'thinking',
              timestamp: new Date().toISOString(),
            },
          ];
        });
        return;
      }
      if (chunkType === 'thinking_summary' || chunkType === 'thinking_summary_complete') {
        setStreamingMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && (last as any).message_type === 'thinking_summary') {
            const updated = [...prev];
            updated[updated.length - 1] = { ...(updated[updated.length - 1] as any), content: ((updated[updated.length - 1] as any).content || '') + (content || '') } as any;
            return updated;
          }
          return [
            ...prev,
            {
              id: `streaming-thinking-summary-${Date.now()}`,
              chat_id: currentChatId!,
              content: content || '',
              role: 'assistant',
              message_type: 'thinking_summary' as any,
              timestamp: new Date().toISOString(),
            } as any,
          ];
        });
        return;
      }
      if (chunkType === 'tool_call_start' || chunkType === 'tool_status' || chunkType === 'tool_call_complete') {
        const callId = (data.call_id as string) || `${Date.now()}`;
        const toolName = (data.tool_name as string) || 'unknown';
        setStreamingMessages(prev => {
          const existingIndex = prev.findIndex(
            (msg) => msg.id.includes(`streaming-tool-${callId}`) && (msg.message_type === 'tool_call_start' || msg.message_type === 'tool_status')
          );
          if (chunkType === 'tool_call_start') {
            return [
              ...prev,
              {
                id: `streaming-tool-${callId}-${Date.now()}`,
                chat_id: currentChatId,
                content: content || '',
                role: 'assistant',
                message_type: 'tool_call_start',
                timestamp: new Date().toISOString(),
                call_id: callId,
                tool_name: toolName,
              },
            ];
          }
          if (chunkType === 'tool_status') {
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = { 
                ...updated[existingIndex], 
                content: content || '', 
                message_type: 'tool_status',
                call_id: callId,
                tool_name: toolName,
              } as any;
              return updated;
            }
            return [
              ...prev,
              {
                id: `streaming-tool-${callId}-${Date.now()}`,
                chat_id: currentChatId,
                content: content || '',
                role: 'assistant',
                message_type: 'tool_status',
                timestamp: new Date().toISOString(),
                call_id: callId,
                tool_name: toolName,
              },
            ];
          }
          if (chunkType === 'tool_call_complete') {
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = { 
                ...updated[existingIndex], 
                content: content || '', 
                message_type: 'tool_call_complete',
                call_id: callId,
                tool_name: toolName,
                success: data.success,
              } as any;
              return updated;
            }
          }
          return prev;
        });
        return;
      }
    });

    // Completion
    service.on('ai_complete', () => {
      setIsStreaming(false);
      setShowImmediateAssistantBubble(false);
      loadChatDetails(currentChatId);
      window.dispatchEvent(new CustomEvent('code-message-received'));
      window.dispatchEvent(new CustomEvent('file-list-refresh'));
    });

    service.connect().then(() => setWsReady(true)).catch(() => setWsReady(false));

    return () => {
      service.disconnect();
    };
  }, [currentChatId]);
  


  const loadChats = async () => {
    try {
      setLoading(true);
      const chatData = await fetchChats();
      setChats(chatData);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatDetails = async (chatId: string) => {
    try {
      setLoadingChat(true);
      const chatData = await fetchChat(chatId);
      setCurrentChat(chatData.chat);
      const dbMessages: Message[] = chatData.messages || [];
      setMessages(dbMessages);
      // Clear streaming tool messages once DB has persisted tool events or when not streaming
      const hasToolMessages = dbMessages.some((m: Message) =>
        m.message_type === 'tool_call_start' ||
        m.message_type === 'tool_status' ||
        m.message_type === 'tool_call_complete'
      );
      if (hasToolMessages || !isStreaming) {
        setStreamingMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chat details:', error);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleNewChat = async () => {
    setLoading(true);
    try {
      const newChat = await createChat('New Chat');
      setChats(prev => [newChat, ...prev]);
      router.push(`/chat/${newChat.id}`);
      show({ variant: 'success', title: 'Chat created', description: 'A new chat has been created.' });
    } catch (error) {
      console.error('Failed to create chat:', error);
      show({ variant: 'error', title: 'Failed to create chat' });
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
      show({ variant: 'success', title: 'Chat deleted' });
    } catch (error) {
      console.error('Failed to delete chat:', error);
      show({ variant: 'error', title: 'Failed to delete chat' });
    }
  };

  const startRename = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(chatId);
    setRenameValue(currentTitle);
  };

  const commitRename = async () => {
    if (!renamingId) return;
    try {
      const updated = await (await import('@/lib/api')).renameChat(renamingId, renameValue.trim() || 'Untitled');
      setChats(prev => prev.map(c => c.id === renamingId ? updated : c));
      show({ variant: 'success', title: 'Chat renamed' });
    } catch (err) {
      console.error('Failed to rename chat', err);
      show({ variant: 'error', title: 'Failed to rename chat' });
    } finally {
      setRenamingId(null);
      setRenameValue('');
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: currentChatId,
      content,
      role: 'user',
      message_type: 'text',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setShowImmediateAssistantBubble(true); // Show assistant bubble immediately
    setStreamingContent('');
    setStreamingType('text');
    setStreamingMessages([]);
    setFilesSummary([]); // Clear files summary for new message
    setStreamingTimestamp(Date.now()); // Reset for streaming messages

    try {
      if (!rt) return;
      if (!wsReady) await rt.connect();
      await rt.sendAIMessage(content);
    } catch (error) {
      console.error('Failed to send message via SSE:', error);
      setIsStreaming(false);
      setShowImmediateAssistantBubble(false);
    }
  };

  // Handle initial message from URL parameter (e.g., from homepage)
  useEffect(() => {
    const initialMessage = searchParams.get('message');
    if (initialMessage && currentChatId && messages.length === 0 && !isStreaming) {
      // Auto-send the initial message when chat is loaded and empty
      handleSendMessage(initialMessage);
      // Clear the URL parameter after sending
      router.replace(`/chat/${currentChatId}`);
    }
  }, [currentChatId, messages.length, isStreaming, searchParams, handleSendMessage, router]);

  // Render chat messages panel when on a chat detail page
  const renderChatPanel = () => {
    if (loadingChat) {
      return (
        <div className="flex items-center justify-center h-full bg-white">
          <ChatLoading />
        </div>
      );
    }

    // Fallback when a chat detail page is open but chat hasn't resolved yet
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-sm text-gray-500">Select a chat on the left to get started.</p>
      </div>
    );
  };

  return (
    <aside className="flex flex-col bg-white h-full w-full relative overflow-hidden">
      {/* Header removed to avoid duplication with unified top navbar */}

      {/* Content area */}
      {!isChatDetailPage ? (
        <div className="flex-1 overflow-y-auto w-full min-h-0">
          <div className="p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full rounded-md border border-gray-200 bg-white/80 backdrop-blur-sm py-1.5 pl-8 pr-3 text-xs focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              {loading ? (
                <ChatListSkeleton />
              ) : (
                <>
                  {chats.map((chat) => {
                    const formatRelative = (iso: string) => {
                      const d = new Date(iso)
                      const now = new Date()
                      const diffMs = now.getTime() - d.getTime()
                      const dayMs = 24 * 60 * 60 * 1000
                      const weekMs = 7 * dayMs
                      if (diffMs < dayMs) {
                        return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      }
                      if (diffMs < 2 * dayMs) {
                        return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      }
                      if (diffMs < 3 * dayMs) {
                        return `2 days ago`
                      }
                      if (diffMs < weekMs) {
                        return `${Math.floor(diffMs / dayMs)} days ago`
                      }
                      if (diffMs < 2 * weekMs) {
                        return `1 week ago`
                      }
                      if (diffMs < 5 * weekMs) {
                        return `${Math.floor(diffMs / weekMs)} weeks ago`
                      }
                      return d.toLocaleDateString()
                    }
                    return (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-2 rounded-md p-3 md:p-2 cursor-pointer transition-all duration-200 min-h-[56px] md:min-h-0 active:scale-[0.98] ${
                        currentChatId === chat.id 
                          ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-l-2 border-blue-400 text-blue-700 shadow-sm' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-cyan-50/50 border-l-2 border-transparent'
                      }`}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${currentChatId === chat.id ? 'text-blue-500' : 'text-gray-500'}`} />
                        <div className="flex-1 min-w-0">
                          {renamingId === chat.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={commitRename}
                                onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); } }}
                                className="w-full text-xs border border-blue-300 rounded px-1 py-0.5"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="truncate text-sm md:text-xs font-medium">{chat.title}</div>
                              <div className="truncate text-xs md:text-[11px] text-gray-500">{formatRelative(chat.updated_at || chat.created_at)}</div>
                            </>
                          )}
                        </div>
                        {currentChatId === chat.id && (
                          <span className="text-[10px] font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 mr-1" aria-current="page">
                            Active
                          </span>
                        )}
                      {chat.file_count > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                          {chat.file_count}
                        </span>
                      )}
                        <button
                          onClick={(e) => startRename(chat.id, chat.title, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                          title="Rename chat"
                        >
                          <Pencil className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </div>
                    )
                  })}
                  
                  {(!loading && chats.length === 0) && (
                    <div className="text-center text-gray-500 py-6 px-4">
                      <div className="max-w-sm mx-auto">
                        <div className="relative mx-auto w-16 h-16 mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full opacity-30 blur-xl"></div>
                          <div className="relative w-full h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <h2 className="text-base font-semibold text-gray-800 mb-2">No chats yet</h2>
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">Create your first chat to generate a prototype.</p>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/90 transition-all duration-200 cursor-pointer group" onClick={handleNewChat}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Plus className="h-4 w-4 text-white" />
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-gray-900 text-sm">Create Chat</p>
                                <p className="text-xs text-gray-500">Start a new prototype conversation</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200/60">
                          <p className="text-[11px] text-gray-500 mb-2 font-medium uppercase tracking-wide">Quick Tips</p>
                          <div className="space-y-1.5 text-[11px] text-gray-600">
                            <p>• Ask me to create a prototype (pages, components)</p>
                            <p>• Request layouts and UI sections</p>
                            <p>• Iterate quickly and preview changes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Show the chat messages when on a chat detail page */
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {isChatDetailPage && currentChat ? (
            <ChatPanel
              chat={currentChat}
              messages={messages}
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              streamingContent={streamingContent}
              streamingType={streamingType}
              streamingMessages={streamingMessages}
              filesSummary={filesSummary}
              showImmediateAssistantBubble={showImmediateAssistantBubble}
            />
          ) : (
            renderChatPanel()
          )}
        </div>
      )}
    </aside>
  );
}
