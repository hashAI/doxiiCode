'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageInput } from '@/components/message-input';
import { MessageList } from '@/components/message-list';
import type { Message } from '@/lib/types';

interface MobileChatInterfaceProps {
  messages: Message[];
  streamingMessages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  onSendMessage: (message: string) => void;
  sheetState: 'collapsed' | 'partial' | 'full';
  chatName?: string;
  filesSummary?: any[];
  showImmediateAssistantBubble?: boolean;
}

export function MobileChatInterface({
  messages,
  streamingMessages,
  isStreaming,
  streamingContent,
  onSendMessage,
  sheetState,
  chatName,
  filesSummary = [],
  showImmediateAssistantBubble = false
}: MobileChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus textarea when sheet opens
  const focusTextarea = () => {
    if (textareaRef.current && sheetState !== 'collapsed') {
      // Small delay to allow sheet animation to complete
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 200);
    }
  };

  useEffect(() => {
    if (sheetState !== 'collapsed') {
      // Small delay to allow sheet animation to complete
      setTimeout(scrollToBottom, 150);
      focusTextarea();
    }
  }, [messages, streamingMessages, sheetState]);

  // Focus textarea when sheet state changes to non-collapsed
  useEffect(() => {
    if (sheetState !== 'collapsed') {
      focusTextarea();
    }
  }, [sheetState]);

  // Remove this - MessageList will handle message combination

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area - only show when not collapsed */}
      {sheetState !== 'collapsed' && (
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto min-h-0"
          style={{ 
            maxHeight: sheetState === 'full' ? 'calc(85vh - 160px)' : sheetState === 'partial' ? 'calc(45vh - 160px)' : 'calc(100vh - 200px)',
            scrollBehavior: 'smooth'
          }}
        >
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            streamingMessages={streamingMessages}
            filesSummary={filesSummary}
            showImmediateAssistantBubble={showImmediateAssistantBubble}
          />
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area - always visible */}
      <div className="border-t border-gray-100 flex-shrink-0 bg-white">
        <MessageInput
          ref={textareaRef}
          onSend={onSendMessage}
          disabled={isStreaming}
          placeholder={
            sheetState === 'collapsed' 
              ? "Type your message..." 
              : "Ask me anything about your prototype..."
          }
        />
      </div>
    </div>
  );
}