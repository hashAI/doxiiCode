'use client';

import { useState, KeyboardEvent, forwardRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
({ onSend, disabled, placeholder = "What do you want to build?" }, ref) => {
    const [message, setMessage] = useState('');

    // Allow external components to prefill the textarea (e.g., from Preview "Fix in chat")
    useEffect(() => {
      const handler = (e: Event) => {
        const ce = e as CustomEvent<{ text?: string }>;
        const text = ce.detail?.text || '';
        if (text) {
          setMessage(prev => {
            const prefix = prev && !prev.endsWith('\n') ? prev + '\n' : prev;
            return (prefix || '') + text;
          });
        }
      };
      window.addEventListener('prefill-chat-input', handler as EventListener);
      return () => window.removeEventListener('prefill-chat-input', handler as EventListener);
    }, []);

    // Allow programmatic submit from Preview Quick Edit
    useEffect(() => {
      const submitHandler = (e: Event) => {
        const ce = e as CustomEvent<{ text?: string }>;
        const text = (ce.detail?.text || '').trim();
        if (text) {
          onSend(text);
          setMessage('');
        }
      };
      window.addEventListener('submit-chat-input', submitHandler as EventListener);
      return () => window.removeEventListener('submit-chat-input', submitHandler as EventListener);
    }, [onSend]);

    const handleSend = () => {
      if (message.trim() && !disabled) {
        onSend(message.trim());
        setMessage('');
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div className="p-3 bg-white">
        <div className="max-w-full mx-auto">
          <div className="flex gap-3 items-end relative">
            <div className="relative flex-1 w-full">
              <Textarea
                ref={ref}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={2}
                className="resize-none border-gray-200 shadow-sm rounded-xl py-3 px-4 min-h-[60px] max-h-48 overflow-auto pr-14 text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 w-full"
                style={{ fontSize: '14px' }} // Prevent iOS zoom on focus
              />
              <Button
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                size="icon"
                className="h-10 w-10 rounded-lg absolute right-2 bottom-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[11px] text-gray-500">
              <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
              <span className="sm:hidden">Tap send to reply</span>
            </p>
            <div className="text-[11px] text-gray-500">
              {message.length}/2000
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';