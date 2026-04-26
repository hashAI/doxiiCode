'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Wrench, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '@/lib/types';

interface AssistantBubbleProps {
  streamingMessages: Message[];
  filesSummary: any[];
  isStreaming: boolean;
}

interface ToolProgress {
  [callId: string]: {
    toolName: string;
    status: 'running' | 'completed';
    message: string;
  };
}

export function AssistantBubble({ 
  streamingMessages, 
  filesSummary, 
  isStreaming
}: AssistantBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  
  // Note: Scrolling is now handled by MessageList component to prevent conflicts
  
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
      'todo_manage': 'Task Management',
    };
    
    return toolNameMap[toolName] || toolName.charAt(0).toUpperCase() + toolName.slice(1).replace(/_/g, ' ');
  };
  
  // Create ordered content blocks to maintain streaming order
  interface ContentBlock {
    type: 'thinking' | 'thinking_summary' | 'text' | 'design' | 'tool' | 'tool_group' | 'todo' | 'files_summary';
    content: string;
    timestamp: string;
    expanded?: boolean;
    toolInfo?: {
      callId: string;
      toolName: string;
      status: 'running' | 'completed';
      success?: boolean;
    };
    todoData?: {
      action: string;
      tasks?: any[];
      task?: any;
      summary?: any;
      message?: string;
    };
  }

  /* 
   * ASSISTANT BUBBLE MESSAGE PROCESSING FIX:
   * 
   * Problem: Previously consolidated consecutive messages (text, thinking) and used complex
   * sorting/grouping logic that broke the natural streaming order.
   * 
   * Solution: Process messages in their exact order from API response:
   * 1. No sorting by timestamp
   * 2. No consolidation of consecutive messages  
   * 3. Each message becomes one content block in order
   * 4. files_summary messages now handled as content blocks (not separate section)
   * 5. During streaming: show tool_call_start, then replace with tool_call_complete
   * 
   * This preserves the exact streaming order users experienced during conversation.
   */
  
  // Process messages in their exact order from API response - no sorting, no complex logic
  const contentBlocks: ContentBlock[] = [];
  
  // Track running tools to replace them with completed ones during streaming
  const runningToolIndices = new Map<string, number>();

  for (const msg of streamingMessages) {
    switch (msg.message_type) {
      case 'thinking':
        contentBlocks.push({
          type: 'thinking',
          content: msg.content,
          timestamp: msg.timestamp,
          expanded: false
        });
        break;
        
      case 'thinking_summary':
        contentBlocks.push({
          type: 'thinking_summary',
          content: msg.content,
          timestamp: msg.timestamp,
          expanded: false
        });
        break;
        
      case 'text':
        // FIXED: Each text message is now a separate block (no consolidation)
        contentBlocks.push({
          type: 'text',
          content: msg.content,
          timestamp: msg.timestamp
        });
        break;
        
      case 'design_inspiration':
        contentBlocks.push({
          type: 'design',
          content: msg.content,
          timestamp: msg.timestamp
        });
        break;
        
      case 'files_summary':
        // FIXED: files_summary now handled as content block in natural order 
        // (no longer separate section at bottom)
        contentBlocks.push({
          type: 'files_summary',
          content: msg.content,
          timestamp: msg.timestamp
        });
        break;
        
      case 'tool_call_start':
        // FIXED: Show tool_call_start during streaming so users see what tool is running
        if (isStreaming) {
          const callId = (msg as any).call_id;
          const toolName = (msg as any).tool_name || 'Tool';
          
          const blockIndex = contentBlocks.length;
          contentBlocks.push({
            type: 'tool',
            content: getDisplayToolName(toolName),
            timestamp: msg.timestamp,
            toolInfo: {
              callId,
              toolName,
              status: 'running',
              success: undefined
            }
          });
          
          // Track this running tool so we can replace it when it completes
          if (callId) {
            runningToolIndices.set(callId, blockIndex);
          }
        }
        break;
        
      case 'tool_status':
        // Skip tool_status - not needed for UI
        break;
        
      case 'tool_call_complete':
        const callId = (msg as any).call_id;
        const toolName = (msg as any).tool_name || 'Tool';
        
        // Parse the content to get the display text
        let displayContent = msg.content;
        try {
          const parsed = JSON.parse(msg.content);
          displayContent = parsed.display_content || parsed.content || msg.content;
        } catch (e) {
          // Use raw content if not valid JSON
        }
        
        // Handle TODO tool specially to extract and display task data
        if (toolName === 'todo_manage') {
          try {
            const toolResult = JSON.parse(msg.content);
            if (toolResult.success) {
              const completedBlock = {
                type: 'todo' as const,
                content: toolResult.message || `${toolResult.action} completed`,
                timestamp: msg.timestamp,
                toolInfo: {
                  callId,
                  toolName,
                  status: 'completed' as const,
                  success: (msg as any).success
                },
                todoData: {
                  action: toolResult.action,
                  tasks: toolResult.tasks,
                  task: toolResult.task,
                  summary: toolResult.summary,
                  message: toolResult.message
                }
              };
              
              // During streaming: replace running tool if it exists, otherwise add new
              if (isStreaming && callId && runningToolIndices.has(callId)) {
                const runningIndex = runningToolIndices.get(callId)!;
                contentBlocks[runningIndex] = completedBlock;
                runningToolIndices.delete(callId);
              } else {
                contentBlocks.push(completedBlock);
              }
              break; // Don't add as regular tool block
            }
          } catch (e) {
            // Fall through to regular tool display if parsing fails
          }
        }
        
        const completedBlock = {
          type: 'tool' as const,
          content: displayContent,
          timestamp: msg.timestamp,
          toolInfo: {
            callId,
            toolName,
            status: 'completed' as const,
            success: (msg as any).success
          }
        };
        
        // FIXED: During streaming, replace running tool if it exists, otherwise add new
        if (isStreaming && callId && runningToolIndices.has(callId)) {
          const runningIndex = runningToolIndices.get(callId)!;
          contentBlocks[runningIndex] = completedBlock;
          runningToolIndices.delete(callId);
        } else {
          contentBlocks.push(completedBlock);
        }
        break;
    }
  }

  const hasFilesSummary = !isStreaming && filesSummary.length > 0;

  // State for expandable sections
  const [expandedBlocks, setExpandedBlocks] = useState<{[key: string]: boolean}>({});
  
  const toggleBlockExpansion = (blockIndex: number) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockIndex]: !prev[blockIndex]
    }));
  };
  
  // Show loading state when streaming but no content yet
  const showLoadingState = isStreaming && contentBlocks.length === 0;

  return (
    <div className="flex justify-start mb-4" ref={bubbleRef}>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 break-words min-w-0 w-auto max-w-[90%]">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-1 min-w-0">
          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">D</span>
          </div>
          <span className="text-xs font-medium text-gray-600 truncate">Doxii</span>
        </div>

        {/* Loading State */}
        {showLoadingState && (
          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-500">Thinking...</span>
          </div>
        )}

        {/* Ordered Content Blocks (maintains streaming order) */}
        {contentBlocks.map((block, index) => {
          const isLast = index === contentBlocks.length - 1;
          const isExpanded = expandedBlocks[index] || false;
          
          switch (block.type) {
            case 'thinking':
              return (
                <div key={`thinking-${index}`} className="mb-3">
                  <button
                    type="button"
                    onClick={() => toggleBlockExpansion(index)}
                    className="flex items-center gap-1.5 mb-1 min-w-0 cursor-pointer select-none"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-blue-800 truncate">Thinking...</span>
                    <ChevronDown className={`ml-1 h-3.5 w-3.5 text-blue-700 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-2 mt-1">
                      <p className="text-sm text-blue-700 whitespace-pre-wrap break-words font-mono leading-relaxed select-text cursor-text">
                        {block.content}
                        {isStreaming && isLast && <span className="animate-pulse text-blue-600 select-none">▊</span>}
                      </p>
                    </div>
                  )}
                </div>
              );
              
            case 'thinking_summary':
              return (
                <div key={`thinking-summary-${index}`} className="mb-3">
                  <button
                    type="button"
                    onClick={() => toggleBlockExpansion(index)}
                    className="flex items-center gap-1.5 mb-1 min-w-0 cursor-pointer select-none"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-indigo-800 truncate">Reasoning summary</span>
                    <ChevronDown className={`ml-1 h-3.5 w-3.5 text-indigo-700 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-2 mt-1">
                      <p className="text-sm text-indigo-700 whitespace-pre-wrap break-words leading-relaxed select-text cursor-text">
                        {block.content}
                        {isStreaming && isLast && <span className="animate-pulse text-indigo-600 select-none">▊</span>}
                      </p>
                    </div>
                  )}
                </div>
              );
              
            case 'tool':
              return (
                <div key={`tool-${index}`} className="mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Wrench className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                    <span className="text-xs text-blue-700 truncate flex-1">{block.content}</span>
                    {block.toolInfo?.status === 'running' && <Loader2 className="h-3 w-3 text-blue-700 animate-spin" />}
                    {block.toolInfo?.status === 'completed' && <span className="text-green-600 text-xs">✓</span>}
                  </div>
                </div>
              );
              
            case 'design':
              return (
                <div key={`design-${index}`} className="mb-3">
                  <div className="bg-purple-50/40 border border-purple-100 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-purple-800">Design Inspiration</span>
                    </div>
                    <p className="text-sm text-purple-700 whitespace-pre-wrap break-words leading-relaxed">
                      {block.content}
                      {isStreaming && isLast && <span className="animate-pulse text-purple-600">▊</span>}
                    </p>
                  </div>
                </div>
              );
              
            case 'text':
              return (
                <div key={`text-${index}`} className="mb-3">
                  <div className="text-sm text-gray-800 leading-relaxed select-text cursor-text prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        code: ({ children, className }) => (
                          <code className={`${className} bg-gray-100 px-1 py-0.5 rounded text-xs font-mono`}>
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono">
                            {children}
                          </pre>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-2 last:mb-0 space-y-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-2 last:mb-0 space-y-1">{children}</ol>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0">{children}</h3>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">{children}</blockquote>
                        ),
                      }}
                    >
                      {block.content}
                    </ReactMarkdown>
                    {isStreaming && isLast && <span className="animate-pulse text-blue-500 ml-1 select-none">▊</span>}
                  </div>
                </div>
              );
              
            case 'todo':
              const todoData = block.todoData;
              return (
                <div key={`todo-${index}`} className="mb-3">
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-emerald-800">Tasks</span>
                      <span className="text-xs text-emerald-600">({todoData?.action})</span>
                    </div>
                    
                    {/* Show task list for 'list' action */}
                    {todoData?.action === 'list' && todoData?.tasks && todoData.tasks.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {todoData.tasks.map((task: any) => (
                          <div key={task.id} className="flex items-center gap-2 text-xs">
                            <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                              task.status === 'completed' ? 'bg-green-500' :
                              task.status === 'in_progress' ? 'bg-blue-500' :
                              task.status === 'blocked' ? 'bg-red-500' : 'bg-gray-400'
                            }`} />
                            <span className="flex-1 text-emerald-700">{task.title}</span>
                            <span className={`text-xs px-1 py-0.5 rounded text-white ${
                              task.priority === 'urgent' ? 'bg-red-500' :
                              task.priority === 'high' ? 'bg-orange-500' :
                              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Show single task for create/update/delete actions */}
                    {todoData?.task && todoData.action !== 'list' && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                            todoData.task.status === 'completed' ? 'bg-green-500' :
                            todoData.task.status === 'in_progress' ? 'bg-blue-500' :
                            todoData.task.status === 'blocked' ? 'bg-red-500' : 'bg-gray-400'
                          }`} />
                          <span className="flex-1 text-emerald-700">{todoData.task.title}</span>
                          <span className={`text-xs px-1 py-0.5 rounded text-white ${
                            todoData.task.priority === 'urgent' ? 'bg-red-500' :
                            todoData.task.priority === 'high' ? 'bg-orange-500' :
                            todoData.task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}>
                            {todoData.task.priority}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Show summary for list action */}
                    {todoData?.summary && (
                      <div className="text-xs text-emerald-600 bg-emerald-50 rounded p-1">
                        {todoData.summary.pending} pending, {todoData.summary.in_progress} in progress, {todoData.summary.completed} completed
                        {todoData.summary.blocked > 0 && `, ${todoData.summary.blocked} blocked`}
                      </div>
                    )}
                    
                    {/* Show action message */}
                    {todoData?.message && (
                      <p className="text-xs text-emerald-700 mt-1">{todoData.message}</p>
                    )}
                  </div>
                </div>
              );
              
            case 'files_summary':
              let filesList: any[] = [];
              try {
                filesList = JSON.parse(block.content);
              } catch (e) {
                // If not valid JSON, skip rendering
                return null;
              }
              
              return (
                <div key={`files-summary-${index}`} className="mb-3">
                  <div className="bg-slate-50/40 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-800">Files Changed</span>
                    </div>
                    <div className="space-y-1">
                      {filesList.map((file: any, fileIndex: number) => (
                        <div key={fileIndex} className="text-[13px] text-slate-700 flex items-center gap-2">
                          <span className="text-blue-600">●</span>
                          <span className="flex-1 font-mono">{file.path}</span>
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
                </div>
              );
              
            default:
              return null;
          }
        })}

        {/* Embedded Operations section removed - all operations now handled in natural order above */}

        {/* Files Summary section removed - now handled as files_summary content blocks in natural order */}
      </div>
    </div>
  );
}