// SSE-only communication
export type RealtimeTransport = 'sse';

export class SSEService {
  private eventSource: EventSource | null = null;
  private chatId: string;
  private url: string;
  private controller: AbortController | null = null;
  private allHandlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor(chatId: string, baseUrl?: string) {
    const api = process.env.NEXT_PUBLIC_API_URL!;
    this.url = (baseUrl || api).replace(/\/$/, '');
    this.chatId = chatId;
  }

  // Minimal API aligning with SocketIOService where used in context
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Mark as connected and emit initial project state
        this.emit('connect', { transport: 'sse' });
        // Fetch initial file list so UI can render
        this.listFiles()
          .then((result) => {
            const files = Array.isArray(result?.files) ? result.files : [];
            this.emit('project_state', { files, project_id: this.chatId });
            resolve();
          })
          .catch(() => resolve());
      } catch (e) {
        reject(e);
      }
    });
  }

  // For AI message streaming, open a new EventSource per request
  sendAIMessage(message: string) {
    this.closeEventSource();
    const qs = new URLSearchParams({ message });
    const streamUrl = `${this.url}/stream/get/${this.chatId}?${qs.toString()}`;
    this.eventSource = new EventSource(streamUrl, { withCredentials: false } as any);

    // Generic data handler
    this.eventSource.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        this.emit('ai_stream', payload);
        if (payload?.chunk_type === 'done' || payload?.type === 'done' || payload?.type === 'stream_end') {
          this.emit('ai_complete', { chat_id: this.chatId });
        }
      } catch (_) {
        // ignore
      }
    };

    this.eventSource.onerror = (_e) => {
      this.emit('ai_error', { error: 'SSE connection error' });
      this.closeEventSource();
    };
  }

  // Manual build removed - Lit projects don't require build steps
  sendManualBuild() {
    // For Lit projects, immediately signal completion as no build is needed
    this.emit('preview_build_start', { chat_id: this.chatId });
    setTimeout(() => {
      this.emit('preview_build_complete', { 
        chat_id: this.chatId, 
        public_html_path: 'index.html', 
        stats: { js_size: 0, css_size: 0, html_size: 0 } 
      });
    }, 100);
  }

  private safeEmitFromEvent(event: string, e: MessageEvent) {
    try {
      const data = JSON.parse(e.data || '{}');
      this.emit(event, data);
    } catch (_) {
      this.emit(event, {});
    }
  }

  on(event: string, handler: (data: any) => void) {
    if (!this.allHandlers.has(event)) this.allHandlers.set(event, new Set());
    this.allHandlers.get(event)!.add(handler);
  }

  off(event: string, handler: (data: any) => void) {
    if (this.allHandlers.has(event)) {
      this.allHandlers.get(event)!.delete(handler);
      if (this.allHandlers.get(event)!.size === 0) this.allHandlers.delete(event);
    }
  }

  listFiles(): Promise<{ files: string[]; truncated?: boolean; error?: string }> {
    // SSE path uses REST for file listing
    const url = `${this.url}/files/chats/${this.chatId}/list`;
    return fetch(url).then((r) => r.json());
  }

  readFile(path: string): Promise<{ content?: string; error?: string; last_modified?: number }> {
    const url = `${this.url}/files/chats/${this.chatId}/content?path=${encodeURIComponent(path)}`;
    return fetch(url).then((r) => r.json());
  }

  async writeFile(path: string, content: string): Promise<{ success: boolean; error?: string }> {
    const url = `${this.url}/files/chats/${this.chatId}/write`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content, create_dirs: true, overwrite: true }),
    });
    const json = await res.json();
    if (!res.ok || json.error) return { success: false, error: json.error || 'Write failed' };
    // Notify listeners to refresh file list
    this.emit('vfs_change', { change_type: 'file_written', path });
    return { success: true, ...(json.current_mtime ? { current_mtime: json.current_mtime } : {}) } as any;
  }

  async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    const url = `${this.url}/files/chats/${this.chatId}/path?path=${encodeURIComponent(path)}`;
    const res = await fetch(url, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || json.error) return { success: false, error: json.error || 'Delete failed' };
    this.emit('vfs_change', { change_type: 'file_deleted', path });
    return json;
  }

  disconnect() {
    this.closeEventSource();
    this.emit('disconnect', { transport: 'sse' });
  }

  private closeEventSource() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private emit(event: string, data: any) {
    const handlers = this.allHandlers.get(event);
    if (handlers) {
      for (const h of handlers) h(data);
    }
  }
}

// SSE-only - backend uses Server-Sent Events for real-time communication


