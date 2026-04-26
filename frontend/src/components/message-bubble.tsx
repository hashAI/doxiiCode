'use client';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      p: any;
    }
  }
}

import { useState } from 'react';
import { FileOperationSummary } from '@/components/file-operation-summary';
import { ChevronDown, Wrench, Loader2 } from 'lucide-react';
import type { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  previousMessage?: Message;
  embeddedOperations?: Message[];
  filesSummary?: any[] | null;
}



export function MessageBubble({ message, isStreaming, previousMessage, embeddedOperations = [], filesSummary = [] }: MessageBubbleProps) {
  // Declare hooks at top level to satisfy React Hooks rules
  const [expanded, setExpanded] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-2xl px-4 py-3 break-words w-full">
          <div className="flex items-center gap-1 mb-1 min-w-0">
            <span className="text-xs font-medium opacity-90 select-none">You</span>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed select-text cursor-text">{message.content}</p>
        </div>
      </div>
    );
  }


  if (message.message_type === 'thinking') {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 shadow-sm break-words min-w-0 w-auto max-w-[80%]">
          <button
            type="button"
            onClick={() => setExpanded(prev => !prev)}
            className="flex items-center gap-1.5 mb-1 min-w-0 cursor-pointer select-none"
          >
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">D</span>
            </div>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
            <span className="text-xs font-medium text-blue-800 truncate">Thinking...</span>
            <ChevronDown className={`ml-1 h-3.5 w-3.5 text-blue-700 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          {expanded && (
            <p className="text-sm text-blue-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
              {message.content}
              {isStreaming && <span className="animate-pulse text-blue-600">▊</span>}
            </p>
          )}
        </div>
      </div>
    );
  }

  const getDisplayToolName = (toolName: string): string => {
    const toolNameMap: { [key: string]: string } = {
      'list_files': 'List Files',
      'read_file': 'Read File',
      'write_file': 'Write File',
      'modify_file': 'Edit File',
      'delete_file': 'Delete File',
      'copy_file': 'Copy File', 
      'move_file': 'Move File',
      'create_directory': 'Create Directory',
      'list_directory_tree': 'Directory Tree',
      'npm_install': 'Install Dependencies',
      'npm_run_script': 'Run Script',
      'npm_list': 'List Packages',
      'node_version': 'Node Version',
      'list_processes': 'List Processes',
      'kill_process': 'Kill Process',
      'design_search_tool': 'Design Search',
      'design_search': 'Design Search',
    };
    
    return toolNameMap[toolName] || toolName.charAt(0).toUpperCase() + toolName.slice(1).replace(/_/g, ' ');
  };

  const ToolHeader = ({
    toolName,
    status,
    message: statusMessage,
    isLive,
  }: { toolName: string; status: 'starting' | 'running' | 'completed'; message?: string; isLive?: boolean }) => {
    const showSpinner = status !== 'completed' || isLive;
    const statusLabel = status === 'starting' ? 'Starting' : status === 'running' ? 'Running' : 'Completed';
    const displayName = getDisplayToolName(toolName);
    
    return (
      <div className="flex justify-start mb-2">
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 shadow-sm min-w-0 w-auto max-w-[80%]">
          <div className="flex items-center gap-2 min-w-0">
            <Wrench className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs font-medium text-blue-700 truncate">{displayName}</span>
            <span className="text-[10px] text-blue-700/70">•</span>
            <span className="text-[11px] text-blue-700 truncate">{statusLabel}</span>
            {showSpinner && <Loader2 className="h-3.5 w-3.5 text-blue-600 animate-spin" />}
          </div>
          {statusMessage && (
            <div className="mt-1 text-[12px] text-blue-700/80 truncate">{statusMessage}</div>
          )}
        </div>
      </div>
    );
  };

  if (message.message_type === 'tool_call_start') {
    // Skip tool_call_start messages - we only show tool_status → tool_call_complete progression
    return null;
  }

  if (message.message_type === 'tool_status') {
    let toolName = (message as any).tool_name || 'Tool';
    let statusMessage = message.content;
    try {
      const parsedContent = JSON.parse(message.content);
      if (parsedContent.tool_name) {
        toolName = parsedContent.tool_name;
        statusMessage = parsedContent.display_content || parsedContent.content || message.content;
      }
    } catch (e) {}
    return <ToolHeader toolName={toolName} status="running" message={statusMessage} isLive={isStreaming} />;
  }

  if (message.message_type === 'tool_call_complete') {
    let toolName = (message as any).tool_name || 'Tool';
    let statusMessage: string | undefined = undefined;
    try {
      const parsedContent = JSON.parse(message.content);
      if (parsedContent.tool_name) {
        toolName = parsedContent.tool_name;
      }
      statusMessage = parsedContent.display_content || parsedContent.content || statusMessage;
    } catch (e) {
      // Fallback: use plain content if not JSON
      const plain = message.content || '';
      statusMessage = plain;
      const inferred = plain.replace('✓ ', '').replace(' completed', '').trim();
      if (inferred) toolName = toolName || inferred;
    }
    return <ToolHeader toolName={toolName} status="completed" message={statusMessage} />;
  }

  if (message.message_type === 'design_inspiration') {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 shadow-sm break-words min-w-0 w-auto max-w-[80%]">
          <div className="flex items-center gap-1.5 mb-2 min-w-0">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">D</span>
            </div>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-600 flex-shrink-0" />
            <span className="text-xs font-medium text-purple-800 truncate">Design Inspiration</span>
          </div>
          <p className="text-sm text-purple-700 whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
            {isStreaming && <span className="animate-pulse text-purple-600">▊</span>}
          </p>
        </div>
      </div>
    );
  }

  // Assistant text message with clear visual distinction
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-50 rounded-2xl px-4 py-3 break-words w-full">
        <div className="flex items-center gap-1.5 mb-1 min-w-0">
          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">D</span>
          </div>
          <span className="text-xs font-medium text-gray-600 truncate">Doxii</span>
        </div>
        {embeddedOperations.length > 0 && (
          <details className="mb-2 group" open={isStreaming ? true : undefined}>
            <summary className="text-xs text-blue-700 flex items-center gap-1 cursor-pointer select-none list-none">
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              <span>Operations</span>
              <span className="text-blue-700/70">({embeddedOperations.length})</span>
            </summary>
            <div className="mt-1 max-h-40 overflow-y-auto rounded-md border bg-blue-50/40 border-blue-100 p-2">
              {embeddedOperations.map(op => (
                <div key={op.id} className="mb-1 last:mb-0">
                  <div className="text-[12px] text-blue-700 truncate">
                    {(() => {
                      try {
                        const parsed = JSON.parse(op.content);
                        return parsed.display_content || parsed.content || op.content;
                      } catch {
                        return op.content;
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed select-text cursor-text">
          {message.content}
          {isStreaming && <span className="animate-pulse text-blue-500 ml-1 select-none">▊</span>}
        </p>

        {/* Files Summary - show at bottom of assistant text messages */}
        {message.role === 'assistant' && message.message_type === 'text' && filesSummary && filesSummary.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-blue-700 mb-2">Files Changed</div>
            <div className="space-y-1">
              {filesSummary.map((file: any, index: number) => (
                <div key={index} className="text-[13px] text-slate-700 flex items-center gap-2">
                  <span className="text-blue-600">●</span>
                  <span className="flex-1">{file.path}</span>
                  {file.lines_added > 0 && (
                    <span className="text-emerald-500 text-[12px] font-medium">+{file.lines_added}</span>
                  )}
                  {file.lines_removed > 0 && (
                    <span className="text-red-500 text-[12px] font-medium">-{file.lines_removed}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show "No files changed" for assistant text messages that had operations but no file changes */}
        {message.role === 'assistant' && message.message_type === 'text' && filesSummary && filesSummary.length === 0 && embeddedOperations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-blue-700 mb-2">Files Changed</div>
            <div className="text-[13px] text-slate-500 italic">No files changed</div>
          </div>
        )}
      </div>
    </div>
  );
}