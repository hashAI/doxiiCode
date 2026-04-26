'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message } from '@/lib/types';
import { MessageBubble } from './message-bubble';
import { AssistantBubble } from './assistant-bubble';
import { MessageCircle } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isStreaming?: boolean;
  streamingMessages?: Message[];
  filesSummary?: any[];
  showImmediateAssistantBubble?: boolean;
}


export function MessageList({ messages, isStreaming, streamingMessages = [], filesSummary = [], showImmediateAssistantBubble = false }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Simple, reliable auto-scroll that works
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Find the actual scrollable element inside Radix ScrollArea
      const scrollAreaRoot = scrollAreaRef.current;
      
      // Find the viewport element with the correct selector
      const viewportElement = 
        scrollAreaRoot.querySelector('[data-slot="scroll-area-viewport"]') ||
        scrollAreaRoot.querySelector('[data-radix-scroll-area-viewport]') ||
        scrollAreaRoot.querySelector('div[style*="overflow"]') ||
        scrollAreaRoot;
      
      console.log('ScrollToBottom debug:', {
        hasScrollAreaRef: !!scrollAreaRef.current,
        viewportElement: viewportElement?.tagName,
        scrollHeight: viewportElement?.scrollHeight,
        clientHeight: viewportElement?.clientHeight,
        scrollTop: viewportElement?.scrollTop,
        canScroll: (viewportElement?.scrollHeight || 0) > (viewportElement?.clientHeight || 0)
      });
      
      if (viewportElement) {
        // Try different scroll methods
        requestAnimationFrame(() => {
          // Method 1: Direct scrollTop
          viewportElement.scrollTop = viewportElement.scrollHeight;
          
          // Method 2: scrollIntoView on last element
          const lastElement = viewportElement.querySelector(':scope > div:last-child');
          if (lastElement) {
            lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
          
          // Method 3: scrollTo
          viewportElement.scrollTo({
            top: viewportElement.scrollHeight,
            behavior: 'smooth'
          });
          
          console.log('After scroll attempt:', viewportElement.scrollTop);
        });
      }
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when streaming messages change
  useEffect(() => {
    if (isStreaming) {
      scrollToBottom();
    }
  }, [streamingMessages, isStreaming]);

  // Continuous scroll during streaming
  useEffect(() => {
    if (isStreaming) {
      const intervalId = setInterval(() => {
        scrollToBottom();
      }, 100); // Frequent updates during streaming
      
      return () => clearInterval(intervalId);
    }
  }, [isStreaming]);

  // Initial scroll on mount and when messages load
  useEffect(() => {
    // Immediate scroll
    scrollToBottom();
    
    // Delayed scroll to handle rendering
    const timeouts = [
      setTimeout(scrollToBottom, 50),
      setTimeout(scrollToBottom, 200),
      setTimeout(scrollToBottom, 500)
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [messages.length]); // Trigger when messages first load
  
  // Filter out code messages but maintain exact order from backend
  const filteredMessages = messages.filter(message => message.message_type !== 'code');
  
  /* 
   * MESSAGE ORDERING FIX:
   * 
   * Problem: Previously, tool_call_complete messages were separated from the main message flow
   * and treated as "embeddedOperations", which broke the natural streaming order.
   * 
   * Solution: Both streaming and non-streaming cases now use the same conversation turn logic:
   * 1. Group messages by conversation turns (user message -> all assistant messages)
   * 2. Keep ALL assistant messages (text, tool_call_complete, files_summary) in their API order
   * 3. Pass them to AssistantBubble which processes them sequentially 
   * 
   * This ensures consistent rendering between streaming and loaded states, matching
   * how modern AI interfaces (Loveable.dev, Cursor) display conversations.
   */
  
  // During streaming, use same conversation turn logic for persisted messages
  if (isStreaming && (streamingMessages.length > 0 || showImmediateAssistantBubble)) {
    // Group persisted messages by conversation turns (same as non-streaming)
    const persistedTurns: Array<{
      userMessage?: Message;
      assistantMessages: Message[];
    }> = [];
    
    let currentTurn: { userMessage?: Message; assistantMessages: Message[] } | null = null;
    
    for (const m of filteredMessages) {
      if (m.role === 'user') {
        // Start a new conversation turn with user message
        if (currentTurn) {
          persistedTurns.push(currentTurn);
        }
        currentTurn = { userMessage: m, assistantMessages: [] };
      } else if (m.role === 'assistant') {
        // FIXED: Add ALL assistant messages (including tool_call_complete, files_summary) 
        // to current turn in their API order - no separation or special handling
        if (!currentTurn) {
          currentTurn = { assistantMessages: [] };
        }
        currentTurn.assistantMessages.push(m);
      }
    }
    
    // Add the final turn
    if (currentTurn) {
      persistedTurns.push(currentTurn);
    }

    // Show persisted conversation turns + single streaming assistant bubble
    return (
      <div ref={scrollAreaRef} className="flex-1 h-full min-h-0 min-w-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 p-4 pb-8 min-w-0">
          {/* Show persisted conversation turns */}
          {persistedTurns.map((turn, turnIndex) => (
            <div key={`persisted-turn-${turnIndex}`}>
              {/* User message */}
              {turn.userMessage && (
                <MessageBubble 
                  message={turn.userMessage} 
                  isStreaming={false}
                  previousMessage={turnIndex > 0 && persistedTurns[turnIndex - 1].userMessage ? persistedTurns[turnIndex - 1].userMessage : undefined}
                  filesSummary={null}
                />
              )}
              
              {/* Assistant messages in single bubble - FIXED: Pass all messages to AssistantBubble 
                   which will render them in their natural API order */}
              {turn.assistantMessages.length > 0 && (
                <AssistantBubble 
                  streamingMessages={turn.assistantMessages}
                  filesSummary={[]}
                  isStreaming={false}
                />
              )}
            </div>
          ))}
          
          {/* Show single streaming assistant bubble */}
          <AssistantBubble 
            streamingMessages={streamingMessages}
            filesSummary={filesSummary}
            isStreaming={isStreaming}
          />
        </div>
        </ScrollArea>
      </div>
    );
  }

  // When not streaming, group assistant messages to display in AssistantBubble like during streaming
  const filteredStreamingMessages = streamingMessages.filter(message => message.message_type !== 'code');
  const allMessages = [...filteredMessages, ...filteredStreamingMessages];
  
  // FIXED: Group messages by conversation turns (user message -> assistant response)
  // Keep ALL messages in their natural order - no separation of tool calls
  // This mirrors the same logic used in streaming case above
  const conversationTurns: Array<{
    userMessage?: Message;
    assistantMessages: Message[];
  }> = [];
  
  let currentTurn: { userMessage?: Message; assistantMessages: Message[] } | null = null;
  
  for (const m of allMessages) {
    if (m.role === 'user') {
      // Start a new conversation turn with user message
      if (currentTurn) {
        conversationTurns.push(currentTurn);
      }
      currentTurn = { userMessage: m, assistantMessages: [] };
    } else if (m.role === 'assistant') {
      // Add ALL assistant messages (including tool_call_complete) to current turn in order
      if (!currentTurn) {
        currentTurn = { assistantMessages: [] };
      }
      currentTurn.assistantMessages.push(m);
    }
  }
  
  // Add the final turn
  if (currentTurn) {
    conversationTurns.push(currentTurn);
  }


  return (
    <div ref={scrollAreaRef} className="flex-1 h-full min-h-0 min-w-0">
      <ScrollArea className="h-full">
        <div className="space-y-3 p-4 pb-8 min-w-0">
        {conversationTurns.length === 0 && (
          <div className="flex items-center justify-center h-48 mt-8">
            <div className="text-center bg-white p-6 rounded-lg border border-gray-200 max-w-sm mx-auto">
              <div className="rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-2">No messages yet</h3>
              <p className="text-xs text-gray-600 mb-3">Describe a page or component to instantly generate a design prototype.</p>
              <div className="text-xs bg-blue-50 text-blue-800 p-2 rounded border border-blue-200">
                <p>Example: "Create a modern SaaS landing with hero, features, and pricing."</p>
              </div>
            </div>
          </div>
        )}
        {conversationTurns.map((turn, turnIndex) => {
          return (
            <div key={`turn-${turnIndex}`}>
              {/* User message */}
              {turn.userMessage && (
                <MessageBubble 
                  message={turn.userMessage} 
                  isStreaming={false}
                  previousMessage={turnIndex > 0 && conversationTurns[turnIndex - 1].userMessage ? conversationTurns[turnIndex - 1].userMessage : undefined}
                  filesSummary={null}
                />
              )}
              
              {/* Assistant messages in single bubble - FIXED: Pass all messages to AssistantBubble 
                   which will render them in their natural API order */}
              {turn.assistantMessages.length > 0 && (
                <AssistantBubble 
                  streamingMessages={turn.assistantMessages}
                  filesSummary={[]}
                  isStreaming={false}
                />
              )}
            </div>
          );
        })}
        </div>
      </ScrollArea>
    </div>
  );
}