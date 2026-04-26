'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Monitor, Smartphone, Maximize2, Minimize2, X } from 'lucide-react';
import { CodeEditor } from '@/components/code-editor';
import { RealtimeProvider, useRealtime } from '@/context/realtime-context';
import { Preview } from '@/components/layout/preview';
import { fetchChatFileContentByPath, listChatWorkspaceFiles } from '@/lib/api';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!
import { fetchChat } from '@/lib/api';
import type { Chat, Message } from '@/lib/types';
import { CodeEditorLoading } from '@/components/ui/loading';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileBottomSheet } from '@/components/mobile-bottom-sheet';
import { MobileChatInterface } from '@/components/mobile-chat-interface';
import { FileTree } from '@/components/layout/file-tree';
import { useUI } from '@/context/ui-context';
import { getLanguageFromFilename } from '@/lib/language-utils';
// Removed direct service usage in favor of shared context

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = params.chatId as string;
  const isMobile = useIsMobile();
  const { setCurrentChat: setUICurrentChat, setSelectedFile } = useUI();
  
  const [loading, setLoading] = useState(true);
  const [codeContent, setCodeContent] = useState('');
  const [currentFilename, setCurrentFilename] = useState('');
  const [language, setLanguage] = useState('html');
  const [showPreview, setShowPreview] = useState(true);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [devServerStatus, setDevServerStatus] = useState<'running' | 'stopped'>('stopped');
  const [devPreviewUrl, setDevPreviewUrl] = useState<string>('');

  // Mobile chat state
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingType, setStreamingType] = useState<string>('text');
  const [streamingMessages, setStreamingMessages] = useState<Message[]>([]);
  const [streamingTimestamp, setStreamingTimestamp] = useState<number>(Date.now());
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [bottomSheetState, setBottomSheetState] = useState<'collapsed' | 'partial' | 'full'>('partial');
  const [filesSummary, setFilesSummary] = useState<any[]>([]);
  const [showImmediateAssistantBubble, setShowImmediateAssistantBubble] = useState(false);
  // Use shared Socket from context within provider below

  // Counter for unique streaming message IDs to prevent duplicate keys
  const [streamingIdCounter, setStreamingIdCounter] = useState(0);
  
  const wsSendRef = useRef<((message: string) => void) | null>(null);

  // Helper function to generate sequential timestamps for streaming messages
  const getNextStreamingTimestamp = () => {
    const timestamp = streamingTimestamp;
    setStreamingTimestamp(prev => prev + 10);
    return new Date(timestamp).toISOString();
  };

  // Helper function to generate unique streaming message IDs
  const getNextStreamingId = (type: string, callId?: string) => {
    const counter = streamingIdCounter;
    setStreamingIdCounter(prev => prev + 1);
    return callId ? `streaming-${type}-${callId}-${counter}` : `streaming-${type}-${counter}`;
  };

  function ChatSocketBindings(props: {
    chatId: string;
    isMobile: boolean;
    bottomSheetState: 'collapsed' | 'partial' | 'full';
    streamingContent: string;
    setFilesSummary: React.Dispatch<React.SetStateAction<any[]>>;
    setStreamingContent: React.Dispatch<React.SetStateAction<string>>;
    setBottomSheetState: React.Dispatch<React.SetStateAction<'collapsed' | 'partial' | 'full'>>;
    setStreamingMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    getNextStreamingId: (type: string, callId?: string) => string;
    setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
    setShowImmediateAssistantBubble: React.Dispatch<React.SetStateAction<boolean>>;
    loadChatDetails: (id: string) => Promise<void>;
    setDevServerStatus: React.Dispatch<React.SetStateAction<'running' | 'stopped'>>;
    setDevPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
    wsSendRef: React.MutableRefObject<((message: string) => void) | null>;
  }) {
    const ws = useRealtime();
    useEffect(() => {
      if (!props.chatId) return;
      // Expose send function
      props.wsSendRef.current = (message: string) => ws.sendAIMessage(message);
      // AI stream handler
      const handleStream = (data: any) => {
        const chunkType = data.chunk_type as string;
        const content = data.content as string;

        if (chunkType === 'files_summary') {
          props.setFilesSummary(Array.isArray(content) ? (content as any[]) : []);
          return;
        }
        if (chunkType === 'text') {
          props.setStreamingContent(prev => prev + (content || ''));
          if (props.isMobile && props.bottomSheetState === 'collapsed' && props.streamingContent === '') {
            props.setBottomSheetState('partial');
          }
          props.setStreamingMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.message_type === 'text') {
              const updated = [...prev];
              updated[updated.length - 1] = { ...last, content: last.content + (content || '') };
              return updated;
            }
            return [
              ...prev,
              {
                id: props.getNextStreamingId('text'),
                chat_id: props.chatId,
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
          props.setStreamingMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.message_type === 'thinking') {
              const updated = [...prev];
              updated[updated.length - 1] = { ...last, content: last.content + (content || '') };
              return updated;
            }
            return [
              ...prev,
              {
                id: props.getNextStreamingId('thinking'),
                chat_id: props.chatId,
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
          props.setStreamingMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.message_type === 'thinking_summary') {
              const updated = [...prev];
              updated[updated.length - 1] = { ...last, content: (last.content || '') + (content || '') } as any;
              return updated;
            }
            return [
              ...prev,
              {
                id: props.getNextStreamingId('thinking_summary'),
                chat_id: props.chatId,
                content: content || '',
                role: 'assistant',
                message_type: 'thinking_summary' as any,
                timestamp: new Date().toISOString(),
              },
            ];
          });
          return;
        }
        if (chunkType === 'tool_call_start' || chunkType === 'tool_status' || chunkType === 'tool_call_complete') {
          const callId = (data.call_id as string) || `${Date.now()}`;
          const toolName = (data.tool_name as string) || 'unknown';
          
          // Debug removed
          
          props.setStreamingMessages(prev => {
            const existingIndex = prev.findIndex(
              (msg) => msg.id.includes(`streaming-tool-${callId}`) && (msg.message_type === 'tool_call_start' || msg.message_type === 'tool_status')
            );
            if (chunkType === 'tool_call_start') {
              return [
                ...prev,
                {
                  id: props.getNextStreamingId('tool', callId),
                  chat_id: props.chatId,
                  content: content || '',
                  role: 'assistant',
                  message_type: 'tool_call_start',
                  timestamp: new Date().toISOString(),
                  call_id: callId,
                  tool_name: toolName,
                } as any,
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
                  id: props.getNextStreamingId('tool', callId),
                  chat_id: props.chatId,
                  content: content || '',
                  role: 'assistant',
                  message_type: 'tool_status',
                  timestamp: new Date().toISOString(),
                  call_id: callId,
                  tool_name: toolName,
                } as any,
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
      };
      ws.onAIStream(handleStream);

      // Completion handler
      const handleComplete = async () => {
        props.setIsStreaming(false);
        props.setShowImmediateAssistantBubble(false);
        // Avoid triggering full page refresh flows; just refresh files below
        window.dispatchEvent(new CustomEvent('file-list-refresh'));
        // Auto-reload preview and code editor after streaming completion
        window.dispatchEvent(new CustomEvent('preview-refresh'));
        window.dispatchEvent(new CustomEvent('code-editor-refresh'));
        // Auto-load preview after completion - use preview endpoint instead of devserver
        try {
          const list = await listChatWorkspaceFiles(props.chatId);
          const hasPkg = (list.files || []).includes('package.json');
          if (hasPkg) {
            // Use preview endpoint instead of devserver
            props.setDevPreviewUrl(`${API_BASE_URL}/preview/${props.chatId}`);
          }
        } catch {}
      };
      ws.onAIComplete?.(handleComplete);

      return () => {
        ws.offAIStream?.(handleStream);
        ws.offAIComplete?.(handleComplete);
      };
    }, [ws, props.chatId, props.isMobile, props.bottomSheetState, props.streamingContent]);
    return null;
  }

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
      loadChatDetails(chatId);
      // Load file list
      listChatWorkspaceFiles(chatId).then((res) => {
        const files = res.files || [];
        setAvailableFiles(files);
        // Default to index.html for preview when available
        if (files.length && !currentFilename) {
          const defaultFile = files.includes('index.html') ? 'index.html' : files[0];
          setCurrentFilename(defaultFile);
          setLanguage(getLanguageFromFilename(defaultFile));
        }
      }).catch(() => setAvailableFiles([]));
      
      // Auto-open mobile bottom sheet when chat loads
      if (isMobile) {
        setBottomSheetState('partial');
        setShowBottomSheet(true);
      }
    }
  }, [chatId, isMobile]);

  // Setup preview source using preview endpoint instead of devserver
  useEffect(() => {
    if (!chatId || !showPreview) return;
    
    console.log('🔧 Preview: Using preview endpoint for React content');
    
    // Always use preview endpoint - no devserver needed
    if (availableFiles.includes('package.json')) {
      setDevPreviewUrl(`${API_BASE_URL}/preview/${chatId}`);
      console.log('🔧 Preview: React project detected, using preview endpoint');
    }
  }, [chatId, showPreview]); // CRITICAL: No availableFiles dependency to prevent preview remount

  // Handle initial message from URL parameter
  useEffect(() => {
    const initialMessage = searchParams.get('message');
    if (initialMessage && chatId && messages.length === 0 && !isStreaming) {
      handleSendMessage(initialMessage);
      router.replace(`/chat/${chatId}`);
    }
  }, [chatId, messages.length, isStreaming, searchParams, router]);

  // Load file content when currentFilename changes
  useEffect(() => {
    if (chatId && currentFilename && !codeContent) {
      const loadFileContent = async () => {
        try {
          const result = await fetchChatFileContentByPath(chatId, currentFilename);
          if (result?.content != null) {
            setCodeContent(result.content);
          }
        } catch (e) {
          console.error('Failed to load file content:', e);
        }
      };
      loadFileContent();
    }
  }, [chatId, currentFilename, codeContent]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Debug viewport size changes
  useEffect(() => {
    console.log('Viewport size changed to:', viewportSize);
  }, [viewportSize]);

  // Handle iframe navigation to keep links within chat context
  useEffect(() => {
    const handleIframeNavigation = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigation') {
        const requestedFile = event.data.href;
        console.log('Iframe requesting navigation to:', requestedFile);
        console.log('Available files:', availableFiles);
        
        // Check if the requested file exists in available files
        if (availableFiles.includes(requestedFile)) {
          console.log('File found, switching to:', requestedFile);
          setCurrentFilename(requestedFile);
          setLanguage(getLanguageFromFilename(requestedFile));
          
          // Force iframe reload with new file
          setTimeout(() => {
            const iframe = document.getElementById('preview-frame') as HTMLIFrameElement;
            const fullscreenIframe = document.getElementById('preview-frame-fullscreen') as HTMLIFrameElement;
            if (iframe) {
              iframe.src = `${API_BASE_URL}/preview/${chatId}/${encodeURIComponent(requestedFile)}`;
            }
            if (fullscreenIframe) {
              fullscreenIframe.src = `${API_BASE_URL}/preview/${chatId}/${encodeURIComponent(requestedFile)}`;
            }
          }, 100);
        } else {
          console.log('File not found in available files:', requestedFile);
          console.log('Trying to reload file list...');
          // Refresh file list and try again
          listChatWorkspaceFiles(chatId).then((res) => {
            const files = res.files || [];
            setAvailableFiles(files);
            if (files.includes(requestedFile)) {
              setCurrentFilename(requestedFile);
              setLanguage(getLanguageFromFilename(requestedFile));
            }
          }).catch(console.error);
        }
      }
    };

    window.addEventListener('message', handleIframeNavigation);
    return () => window.removeEventListener('message', handleIframeNavigation);
  }, [availableFiles, chatId]);

  // Inject navigation interceptor script into iframe
  useEffect(() => {
    const iframe = document.getElementById('preview-frame') as HTMLIFrameElement;
    const fullscreenIframe = document.getElementById('preview-frame-fullscreen') as HTMLIFrameElement;
    
    const injectNavigationHandler = (iframeElement: HTMLIFrameElement) => {
      if (!iframeElement) return;
      
      iframeElement.onload = () => {
        try {
          const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document;
          if (iframeDoc) {
            // Add base tag to ensure relative links work correctly
            let baseTag = iframeDoc.querySelector('base');
            if (!baseTag) {
              baseTag = iframeDoc.createElement('base');
              iframeDoc.head.appendChild(baseTag);
            }
            baseTag.href = `${API_BASE_URL}/preview/${chatId}/`;
            
            // Inject script to intercept navigation
            const script = iframeDoc.createElement('script');
            script.textContent = `
              console.log('Navigation handler injected for chat \${chatId}');
              
              // Intercept all link clicks
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.href) {
                  console.log('Link clicked:', link.href);
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Parse the URL to get just the filename
                  let filename;
                  try {
                    const url = new URL(link.href);
                    filename = url.pathname.split('/').pop() || url.pathname.substring(1);
                    console.log('Extracted filename:', filename);
                  } catch (err) {
                    // If URL parsing fails, try to extract from href attribute
                    filename = link.getAttribute('href');
                    console.log('Using href attribute:', filename);
                  }
                  
                  if (filename) {
                    if (filename.endsWith('.html') || !filename.includes('.')) {
                      // Handle HTML navigation within chat context
                      console.log('Navigating to:', filename);
                      const newUrl = '\${API_BASE_URL}/preview/\${chatId}/' + filename;
                      console.log('Full URL:', newUrl);
                      window.location.href = newUrl;
                    } else {
                      // For other files, open in new tab with chat context
                      const newUrl = '\${API_BASE_URL}/preview/\${chatId}/' + filename;
                      console.log('Opening in new tab:', newUrl);
                      window.open(newUrl, '_blank');
                    }
                  }
                }
              });
              
              // Fix broken images and other resources
              function fixResourceUrls() {
                console.log('Fixing resource URLs...');
                
                // Fix images
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                  if (img.src && !img.src.includes('\${chatId}') && !img.src.startsWith('data:')) {
                    const filename = img.src.split('/').pop();
                    if (filename) {
                      const newSrc = '\${API_BASE_URL}/preview/\${chatId}/' + filename;
                      console.log('Fixing image:', img.src, '->', newSrc);
                      img.src = newSrc;
                    }
                  }
                });
                
                // Fix CSS background images
                const elements = document.querySelectorAll('*');
                elements.forEach(el => {
                  const style = window.getComputedStyle(el);
                  const bgImage = style.backgroundImage;
                  if (bgImage && bgImage !== 'none' && !bgImage.includes('\${chatId}')) {
                    const match = bgImage.match(/url\\\\(['"]?([^'"\\\\)]+)['"]?\\\\)/);
                    if (match && match[1]) {
                      const filename = match[1].split('/').pop();
                      if (filename) {
                        const newUrl = '\${API_BASE_URL}/preview/\${chatId}/' + filename;
                        el.style.backgroundImage = 'url("' + newUrl + '")';
                      }
                    }
                  }
                });
              }
              
              // Run immediately and on DOM changes
              fixResourceUrls();
              document.addEventListener('DOMContentLoaded', fixResourceUrls);
              
              // Handle navigation events
              window.addEventListener('beforeunload', function(e) {
                console.log('Page attempting to navigate, preventing...');
                e.preventDefault();
                return false;
              });
            `;
            iframeDoc.head.appendChild(script);
          }
        } catch (error) {
          // Ignore cross-origin errors
          console.log('Could not inject navigation handler due to cross-origin restrictions');
        }
      };
    };

    if (iframe) injectNavigationHandler(iframe);
    if (fullscreenIframe) injectNavigationHandler(fullscreenIframe);
  }, [currentFilename, showPreview, chatId]);

  // Handle code view toggle from bottom nav
  useEffect(() => {
    const handleToggleCodeView = () => {
      setShowPreview(prev => {
        const newValue = !prev;
        // Notify bottom nav of state change
        window.dispatchEvent(new CustomEvent('code-view-state-change', { 
          detail: { showPreview: newValue } 
        }));
        return newValue;
      });
    };

    window.addEventListener('toggle-code-view', handleToggleCodeView);
    return () => window.removeEventListener('toggle-code-view', handleToggleCodeView);
  }, []);

  // Listen to unified header mode changes
  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const ce = e as CustomEvent<{ mode?: 'code' | 'preview' }>;
      if (ce.detail?.mode) {
        setShowPreview(ce.detail.mode === 'preview');
      }
    };
    window.addEventListener('mode-change', handleModeChange as EventListener);
    return () => window.removeEventListener('mode-change', handleModeChange as EventListener);
  }, []);

  // Notify bottom nav when showPreview changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('code-view-state-change', { 
      detail: { showPreview } 
    }));
  }, [showPreview]);

  const loadChatDetails = async (id: string) => {
    try {
      const chatData = await fetchChat(id);
      console.log('Loaded chat data:', chatData); // Debug log
      const chat = chatData.chat;
      setCurrentChat(chat); // Fix: extract chat from response
      setUICurrentChat(chat); // Also update UI context
      // chatData.messages is flattened by API adapter; keep order as provided
      setMessages(chatData.messages || []);
    } catch (error) {
      console.error('Failed to load chat details:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!chatId) return;

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
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
    setStreamingTimestamp(Date.now());
    setStreamingIdCounter(0); // Reset ID counter for new conversation

    // Auto-expand to partial when sending message
    if (isMobile && bottomSheetState === 'collapsed') {
      setBottomSheetState('partial');
    }

    try {
      wsSendRef.current?.(content);
    } catch (error) {
      console.error('Failed to send message via WebSocket:', error);
      setIsStreaming(false);
      setShowImmediateAssistantBubble(false);
    }
  };

  const loadChat = async (id: string) => {
    try {
      setLoading(true);
      const chatData = await fetchChat(id);
      
      // Extract code from messages for the code editor
      const codeMessages = chatData.messages?.filter((m: Message) => m.message_type === 'code') || [];
      if (codeMessages.length > 0) {
        // Use the latest code message
        const latestCodeMessage = codeMessages[codeMessages.length - 1];
        setCodeContent(latestCodeMessage.content);
        // Keep current file selection if present; otherwise try index.html
        if (!currentFilename) {
          setCurrentFilename('index.html');
          setLanguage('html');
        }
      }
      
      // If we have a current filename but no code content, try to load the file
      if (currentFilename && !codeContent) {
        try {
          const result = await fetchChatFileContentByPath(chatId, currentFilename);
          if (result?.content != null) {
            setCodeContent(result.content);
          }
        } catch (e) {
          console.error('Failed to load file content:', e);
        }
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  // Listen for code updates from the sidebar chat
  useEffect(() => {
    const handleCodeUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { content, type, filename } = customEvent.detail as { content: string; type: 'append' | 'replace'; filename?: string };
        if (filename) {
          setCurrentFilename(filename);
          setLanguage(getLanguageFromFilename(filename));
        }
        if (type === 'append') {
          setCodeContent(prev => prev + content);
        } else if (type === 'replace') {
          setCodeContent(content);
        }
      }
    };
    const handleCodeOpenFile = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { filename } = (customEvent.detail || {}) as { filename?: string };
      if (filename) {
        setCurrentFilename(filename);
        setLanguage(getLanguageFromFilename(filename));
        // Fetch file content from backend by path under chat root
        try {
          const result = await fetchChatFileContentByPath(chatId, filename);
          if (result?.content != null) {
            setCodeContent(result.content);
          }
        } catch (e) {
          console.error('Failed to fetch file content by path', e);
        }
      }
    };
    
    const handleCodeMessageReceived = () => {
      // Only refresh code editor and preview, not the entire chat
      // This prevents full page reload when AI completes response
      console.log('Code message received - skipping chat reload to prevent full page refresh');
    };
    const handleFileListRefresh = async () => {
      try {
        const res = await listChatWorkspaceFiles(chatId);
        const files = res.files || [];
        setAvailableFiles(files);
        // If Preview is active and a new HTML file appears, auto-select it
        if (showPreview && files.length) {
          // If currentFilename no longer exists or is empty, prefer index.html or the newest
          const preferred = files.includes('index.html') ? 'index.html' : files[files.length - 1];
          if (!currentFilename || !files.includes(currentFilename)) {
            setCurrentFilename(preferred);
            setLanguage(getLanguageFromFilename(preferred));
          }
        }
      } catch {}
    };

    const handleCodeEditorFileReload = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { fileId } = (customEvent.detail || {}) as { fileId?: string };
      if (fileId) {
        try {
          // Reload the current file content from the server
          const result = await fetchChatFileContentByPath(chatId, fileId);
          if (result?.content != null) {
            setCodeContent(result.content);
          }
        } catch (e) {
          console.error('Failed to reload file content:', e);
        }
      }
    };
    
    window.addEventListener('code-update', handleCodeUpdate);
    window.addEventListener('code-open-file', handleCodeOpenFile);
    window.addEventListener('code-message-received', handleCodeMessageReceived);
    window.addEventListener('file-list-refresh', handleFileListRefresh);
    window.addEventListener('code-editor-file-reload', handleCodeEditorFileReload);
    
    return () => {
      window.removeEventListener('code-update', handleCodeUpdate);
      window.removeEventListener('code-open-file', handleCodeOpenFile);
      window.removeEventListener('code-message-received', handleCodeMessageReceived);
      window.removeEventListener('file-list-refresh', handleFileListRefresh);
      window.removeEventListener('code-editor-file-reload', handleCodeEditorFileReload);
    };
  }, [chatId]);


  // Simple syntax highlighting for mobile
  const highlightCode = (code: string, lang: string): string => {
    if (!code) return '';
    
    // Escape HTML first
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Simple highlighting based on language
    switch (lang) {
      case 'html':
        return escaped
          .replace(/(&lt;\/?[^&\s]+)([^&]*&gt;)/g, '<span class="text-blue-400">$1</span><span class="text-green-400">$2</span>')
          .replace(/(\w+)=/g, '<span class="text-yellow-400">$1</span>=')
          .replace(/"([^"]*)"/g, '"<span class="text-green-300">$1</span>"');
      case 'css':
        return escaped
          .replace(/([a-zA-Z-]+)\s*:/g, '<span class="text-blue-400">$1</span>:')
          .replace(/:\s*([^;]+);/g, ': <span class="text-green-400">$1</span>;')
          .replace(/\{|\}/g, '<span class="text-yellow-400">$&</span>');
      case 'javascript':
      case 'typescript':
        return escaped
          .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g, '<span class="text-blue-400">$1</span>')
          .replace(/'([^']*)'/g, "'<span class=\"text-green-400\">$1</span>'")
          .replace(/"([^"]*)"/g, '"<span class="text-green-400">$1</span>"')
          .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>');
      default:
        return escaped;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <CodeEditorLoading />
      </div>
    );
  }

  return (
    <RealtimeProvider chatId={chatId} autoConnect={true}>
      <ChatSocketBindings
        chatId={chatId}
        isMobile={isMobile}
        bottomSheetState={bottomSheetState}
        streamingContent={streamingContent}
        setFilesSummary={setFilesSummary}
        setStreamingContent={setStreamingContent}
        setBottomSheetState={setBottomSheetState}
        setStreamingMessages={setStreamingMessages}
        getNextStreamingId={getNextStreamingId}
        setIsStreaming={setIsStreaming}
        setShowImmediateAssistantBubble={setShowImmediateAssistantBubble}
        loadChatDetails={loadChatDetails}
        setDevServerStatus={setDevServerStatus}
        setDevPreviewUrl={setDevPreviewUrl}
        wsSendRef={wsSendRef}
      />
      <div className="h-full w-full flex flex-col bg-gray-50 min-h-0 min-w-0 relative">
        {/* Tab bar removed - unified header now controls mode switching */}

      {/* Content Area with file tree */}
      <div className="flex-1 overflow-hidden min-h-0 flex">
        {!showPreview ? (
          <>
            <div className="h-full min-h-0 flex-1 flex flex-col">
              {codeContent ? (
                <>
                  {/* Mobile Code Viewer */}
                  <div className="block md:hidden h-full bg-white flex flex-col">
                  
                  <div className="flex-1 overflow-auto">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span className="text-sm font-mono text-gray-600 ml-2 truncate">{currentFilename || 'code'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigator.clipboard?.writeText(codeContent)}
                            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors active:scale-95 min-h-[32px]"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => setShowPreview(true)}
                            className="px-3 py-2 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors active:scale-95 min-h-[32px]"
                            disabled={devServerStatus !== 'running' && language !== 'html'}
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                      <pre className="text-xs md:text-sm font-mono bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-all leading-tight">
                        <code dangerouslySetInnerHTML={{ __html: highlightCode(codeContent, language) }} />
                      </pre>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Code Editor */}
                <div className="hidden md:block h-full">
                  <CodeEditor
                    initialContent={codeContent}
                    onContentChange={(content) => setCodeContent(content)}
                    readOnly={false}
                    language={language}
                  />
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
                <div className="text-center p-4">
                  <div className="text-lg mb-2">🧪 Code Editor</div>
                  <p className="text-sm">Generated code will appear here</p>
                  <p className="text-xs text-gray-400 mt-1">Ask me to create a prototype or components</p>
                </div>
              </div>
            )}
            </div>
            
            {/* File Tree Sidebar - Right Side */}
            <div className="hidden md:block w-64 border-l bg-white">
              <FileTree chatId={chatId} onFileSelect={(path, content) => {
                setCurrentFilename(path);
                setSelectedFile(path); // Update UI context
                const detectedLang = getLanguageFromFilename(path);
                setLanguage(detectedLang);
                setCodeContent(content);
                setShowPreview(detectedLang === 'html' && showPreview);
              }} />
            </div>
          </>
        ) : (
          <div className="h-full min-h-0 flex-1">
            <Preview chatId={chatId} />
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet Chat - only on mobile */}
      {isMobile && (
        <MobileBottomSheet
          isOpen={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          defaultState={bottomSheetState}
          onStateChange={setBottomSheetState}
          chatName={currentChat?.title}
        >
          <MobileChatInterface
            messages={messages}
            streamingMessages={streamingMessages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onSendMessage={handleSendMessage}
            sheetState={bottomSheetState}
            chatName={currentChat?.title}
            filesSummary={filesSummary}
            showImmediateAssistantBubble={showImmediateAssistantBubble}
          />
        </MobileBottomSheet>
      )}
      </div>
    </RealtimeProvider>
  );
}