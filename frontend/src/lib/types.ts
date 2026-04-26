export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  file_count: number;
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  role: 'user' | 'assistant';
  message_type: 'text' | 'code' | 'file_operation' | 'design_inspiration' | 'thinking' | 'thinking_summary' | 'tool_call_start' | 'tool_status' | 'tool_call_complete' | 'files_summary';
  timestamp: string;
  // Optional fields for ordering and reconciliation
  turn_id?: string | null;
  message_id?: string | null;
}

export interface FileItem {
  id: string;
  chat_id: string;
  filename: string;
  file_path: string;
  created_at: string;
}

export interface StreamChunk {
  type: 'text' | 'file_operation' | 'design_inspiration' | 'code' | 'error' | 'done' | 'thinking' | 'thinking_complete' | 'thinking_summary' | 'thinking_summary_complete' | 'tool_call_start' | 'tool_status' | 'tool_call_complete' | 'connection' | 'stream_end' | 'files_summary';
  content: string | any[];
  // Tool-specific metadata
  call_id?: string;
  tool_name?: string;
  success?: boolean; // for tool_call_complete
  // Additional metadata from backend
  filename?: string; // for code events from write_file operations  
  // Reasoning metadata
  item_id?: string;
  content_index?: number;
  summary_index?: number;
}