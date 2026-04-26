'use client';

import { useEffect, useRef } from 'react';
import { MessageList } from '@/components/message-list';
import { MessageInput } from '@/components/message-input';
import type { Message, Chat } from '@/lib/types';

interface ChatPanelProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isStreaming?: boolean;
  streamingContent?: string;
  streamingType?: string;
  streamingMessages?: Message[];
  filesSummary?: any[];
  showImmediateAssistantBubble?: boolean;
}

export function ChatPanel({ 
  chat, 
  messages, 
  onSendMessage, 
  isStreaming = false, 
  streamingMessages = [],
  filesSummary = [],
  showImmediateAssistantBubble = false
}: ChatPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when chat loads or changes
  useEffect(() => {
    if (chat && textareaRef.current) {
      // Small delay to ensure component is fully rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [chat.id]);

  // Listen for prefill requests (from Preview "Fix in chat" button)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ text?: string }>; 
      const text = ce.detail?.text || '';
      if (textareaRef.current && text) {
        const ta = textareaRef.current;
        const current = ta.value || '';
        const prefix = current && !current.endsWith('\n') ? current + '\n' : current;
        ta.value = prefix + text;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.focus();
      }
    };
    window.addEventListener('prefill-chat-input', handler as EventListener);
    return () => window.removeEventListener('prefill-chat-input', handler as EventListener);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white w-full">
      {/* Header removed - chat name is now displayed in unified top navbar */}

      {/* Messages */}
      <div className="flex-1 overflow-hidden min-h-0 w-full">
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          streamingMessages={streamingMessages}
          filesSummary={filesSummary}
          showImmediateAssistantBubble={showImmediateAssistantBubble}
        />
      </div>

      {/* Input */}
      <div className="border-t">
        <MessageInput
          ref={textareaRef}
          onSend={onSendMessage}
          disabled={isStreaming}
        />
      </div>
    </div>
  );
}