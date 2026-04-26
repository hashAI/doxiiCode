'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { SSEService, RealtimeTransport } from '@/lib/realtime';

interface RealtimeContextType {
  // Connection status
  isConnected: boolean;
  connectionError: string | null;
  
  // Project state
  files: string[];
  
  // File operations
  writeFile: (path: string, content: string, lastModified?: number) => Promise<{ success: boolean; error?: string; conflict?: boolean; current_mtime?: number }>;
  readFile: (path: string) => Promise<{ content?: string; error?: string; last_modified?: number }>;
  deleteFile: (path: string) => Promise<{ success: boolean; error?: string }>;
  listFiles: () => Promise<{ files: string[]; truncated?: boolean; error?: string }>;
  
  // AI operations
  sendAIMessage: (message: string) => void;
  sendManualBuild: () => void;
  
  // Preview build events
  onPreviewBuildStart?: (handler: (data: any) => void) => void;
  onPreviewDependencyCheck?: (handler: (data: any) => void) => void;
  onPreviewDependencyCheckComplete?: (handler: (data: any) => void) => void;
  onPreviewDependencyInstallStart?: (handler: (data: any) => void) => void;
  onPreviewDependencyInstallComplete?: (handler: (data: any) => void) => void;
  onPreviewBuildCompileStart?: (handler: (data: any) => void) => void;
  onPreviewBuildCompileComplete?: (handler: (data: any) => void) => void;
  onPreviewBuildHtmlComplete?: (handler: (data: any) => void) => void;
  onPreviewBuildComplete?: (handler: (data: any) => void) => void;
  onPreviewBuildError?: (handler: (data: any) => void) => void;
  onPreviewViteBuildStart?: (handler: (data: any) => void) => void;
  onPreviewViteBuildComplete?: (handler: (data: any) => void) => void;

  // Preview build event un-subscribers
  offPreviewBuildStart?: (handler: (data: any) => void) => void;
  offPreviewDependencyCheck?: (handler: (data: any) => void) => void;
  offPreviewDependencyCheckComplete?: (handler: (data: any) => void) => void;
  offPreviewDependencyInstallStart?: (handler: (data: any) => void) => void;
  offPreviewDependencyInstallComplete?: (handler: (data: any) => void) => void;
  offPreviewBuildCompileStart?: (handler: (data: any) => void) => void;
  offPreviewBuildCompileComplete?: (handler: (data: any) => void) => void;
  offPreviewBuildHtmlComplete?: (handler: (data: any) => void) => void;
  offPreviewBuildComplete?: (handler: (data: any) => void) => void;
  offPreviewBuildError?: (handler: (data: any) => void) => void;
  offPreviewViteBuildStart?: (handler: (data: any) => void) => void;
  offPreviewViteBuildComplete?: (handler: (data: any) => void) => void;
  
  // Event handlers
  onVFSChange: (handler: (data: any) => void) => void;
  onAIStream: (handler: (data: any) => void) => void;
  offAIStream?: (handler: (data: any) => void) => void;
  onAIComplete?: (handler: (data: any) => void) => void;
  offAIComplete?: (handler: (data: any) => void) => void;
  onFileOpResult: (handler: (data: any) => void) => void;
  onProjectState: (handler: (data: any) => void) => void;
  
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

interface RealtimeProviderProps {
  chatId: string;
  children: React.ReactNode;
  autoConnect?: boolean;
}

export function RealtimeProvider({ chatId, children, autoConnect = true }: RealtimeProviderProps) {
  // SSE-only communication
  const socketService = useMemo(() => {
    return new SSEService(chatId);
  }, [chatId]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  // Initialize SSE service
  useEffect(() => {
    const service = socketService;
    // Set up event handlers
    service.on('connect', () => {
      console.log('SSE connected');
      setIsConnected(true);
      setConnectionError(null);
    });

    service.on('disconnect', () => {
      console.log('SSE disconnected');
      setIsConnected(false);
    });

    service.on('connect_error', (error: any) => {
      console.error('SSE connection error:', error);
      setConnectionError(error.message || 'Connection failed');
      setIsConnected(false);
    });

    service.on('project_state', (data: any) => {
      console.log('Received project state:', data);
      setFiles(data.files || []);
    });

    service.on('vfs_change', (data: any) => {
      console.log('VFS change:', data);
      // Refresh file list on any change event
      service.listFiles();
    });

    service.on('file_op_result', (data: any) => {
      if (data.op === 'list' && data.result?.files) {
        setFiles(data.result.files);
      }
    });

    // Auto-connect if enabled
    if (autoConnect) {
      // Connect the specific service instance created for this chatId
      service.connect().catch((err) => {
        console.error('SSE autoConnect failed:', err);
        setConnectionError(err instanceof Error ? err.message : 'Connection failed');
        setIsConnected(false);
      });
    }

    // Cleanup on unmount
    return () => {
      service.disconnect();
    };
  }, [socketService, autoConnect]);

  const connect = useCallback(async () => {
    try {
      setConnectionError(null);
      await socketService.connect();
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      setIsConnected(false);
      throw error;
    }
  }, [socketService]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
  }, [socketService]);

  // File operations
  const writeFile = useCallback(async (path: string, content: string, lastModified?: number) => {
    return await socketService.writeFile(path, content, lastModified);
  }, [socketService]);

  const readFile = useCallback(async (path: string) => {
    return await socketService.readFile(path);
  }, [socketService]);

  const deleteFile = useCallback(async (path: string) => {
    return await socketService.deleteFile(path);
  }, [socketService]);

  const listFiles = useCallback(async () => {
    return await socketService.listFiles();
  }, [socketService]);

  // AI operations
  const sendAIMessage = useCallback((message: string) => {
    socketService.sendAIMessage(message);
  }, [socketService]);

  const sendManualBuild = useCallback(() => {
    socketService.sendManualBuild();
  }, [socketService]);

  // Preview build event handlers
  const onPreviewBuildStart = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_build_start', handler);
  }, [socketService]);

  const onPreviewBuildComplete = useCallback((handler: (data: any) => void) => {
    console.log('RealtimeContext: Registering onPreviewBuildComplete handler', true);
    socketService.on('preview_build_complete', handler);
  }, [socketService]);

  const onPreviewBuildError = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_build_error', handler);
  }, [socketService]);

  const onPreviewDependencyCheck = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_dependency_check', handler);
  }, [socketService]);

  const onPreviewDependencyCheckComplete = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_dependency_check_complete', handler);
  }, [socketService]);

  const onPreviewDependencyInstallStart = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_dependency_install_start', handler);
  }, [socketService]);

  const onPreviewDependencyInstallComplete = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_dependency_install_complete', handler);
  }, [socketService]);

  const onPreviewBuildCompileStart = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_build_compile_start', handler);
  }, [socketService]);

  const onPreviewBuildCompileComplete = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_build_compile_complete', handler);
  }, [socketService]);

  const onPreviewBuildHtmlComplete = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_build_html_complete', handler);
  }, [socketService]);

  // Vite build event handlers
  const onPreviewViteBuildStart = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_vite_build_start', handler);
  }, [socketService]);

  const onPreviewViteBuildComplete = useCallback((handler: (data: any) => void) => {
    socketService.on('preview_vite_build_complete', handler);
  }, [socketService]);

  // Off handlers
  const offPreviewBuildStart = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_build_start', handler);
  }, [socketService]);

  const offPreviewDependencyCheck = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_dependency_check', handler);
  }, [socketService]);

  const offPreviewDependencyCheckComplete = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_dependency_check_complete', handler);
  }, [socketService]);

  const offPreviewDependencyInstallStart = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_dependency_install_start', handler);
  }, [socketService]);

  const offPreviewDependencyInstallComplete = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_dependency_install_complete', handler);
  }, [socketService]);

  const offPreviewBuildCompileStart = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_build_compile_start', handler);
  }, [socketService]);

  const offPreviewBuildCompileComplete = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_build_compile_complete', handler);
  }, [socketService]);

  const offPreviewBuildHtmlComplete = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_build_html_complete', handler);
  }, [socketService]);

  const offPreviewBuildComplete = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_build_complete', handler);
  }, [socketService]);

  const offPreviewBuildError = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_build_error', handler);
  }, [socketService]);

  const offPreviewViteBuildStart = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_vite_build_start', handler);
  }, [socketService]);

  const offPreviewViteBuildComplete = useCallback((handler: (data: any) => void) => {
    socketService.off('preview_vite_build_complete', handler);
  }, [socketService]);

  // Event handler registration
  const onVFSChange = useCallback((handler: (data: any) => void) => {
    socketService.on('vfs_change', handler);
  }, [socketService]);

  const onAIStream = useCallback((handler: (data: any) => void) => {
    socketService.on('ai_stream', handler);
  }, [socketService]);

  const offAIStream = useCallback((handler: (data: any) => void) => {
    socketService.off('ai_stream', handler);
  }, [socketService]);

  const onAIComplete = useCallback((handler: (data: any) => void) => {
    socketService.on('ai_complete', handler);
  }, [socketService]);

  const onFileOpResult = useCallback((handler: (data: any) => void) => {
    socketService.on('file_op_result', handler);
  }, [socketService]);

  const onProjectState = useCallback((handler: (data: any) => void) => {
    socketService.on('project_state', handler);
  }, [socketService]);

  const offAIComplete = useCallback((handler: (data: any) => void) => {
    socketService.off('ai_complete', handler);
  }, [socketService]);

  const contextValue: RealtimeContextType = {
    isConnected,
    connectionError,
    files,
    writeFile,
    readFile,
    deleteFile,
    listFiles,
    sendAIMessage,
    sendManualBuild,
    onPreviewBuildStart,
    onPreviewDependencyCheck,
    onPreviewDependencyCheckComplete,
    onPreviewDependencyInstallStart,
    onPreviewDependencyInstallComplete,
    onPreviewBuildCompileStart,
    onPreviewBuildCompileComplete,
    onPreviewBuildHtmlComplete,
    onPreviewBuildComplete,
    onPreviewBuildError,
    onPreviewViteBuildStart,
    onPreviewViteBuildComplete,
    offPreviewBuildStart,
    offPreviewDependencyCheck,
    offPreviewDependencyCheckComplete,
    offPreviewDependencyInstallStart,
    offPreviewDependencyInstallComplete,
    offPreviewBuildCompileStart,
    offPreviewBuildCompileComplete,
    offPreviewBuildHtmlComplete,
    offPreviewBuildComplete,
    offPreviewBuildError,
    offPreviewViteBuildStart,
    offPreviewViteBuildComplete,
    onVFSChange,
    onAIStream,
    offAIStream,
    onAIComplete,
    onFileOpResult,
    onProjectState,
    offAIComplete,
    connect,
    disconnect,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime(): RealtimeContextType {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}

export function useRealtimeOptional(): RealtimeContextType | null {
  return useContext(RealtimeContext);
}