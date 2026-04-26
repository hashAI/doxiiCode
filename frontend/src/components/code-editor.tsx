'use client';

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useRealtime } from '@/context/realtime-context';
import { useUI } from '@/context/ui-context';

interface CodeEditorProps {
  fileId?: string;
  initialContent: string;
  onContentChange?: (content: string) => void;
  readOnly?: boolean;
  language?: string;
  filename?: string;
  lastModified?: number;
}

const getLanguageFromFilename = (filename: string): string => {
  if (!filename) return 'text';
  
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jsx':
      return 'javascript';
    case 'tsx':
      return 'typescript';
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    case 'txt':
      return 'text';
    case 'gitignore':
      return 'text';
    default:
      return 'text';
  }
};

export function CodeEditor({ fileId, initialContent, onContentChange, readOnly = false, language, filename, lastModified }: CodeEditorProps) {
  // Auto-detect language from filename if not provided
  const detectedLanguage = language || getLanguageFromFilename(filename || '');
  const displayLanguage = filename?.endsWith('.jsx') ? 'JSX'
                          : filename?.endsWith('.tsx') ? 'TSX'
                          : detectedLanguage.toUpperCase();
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [savedMtime, setSavedMtime] = useState<number | null>(null);
  const editorRef = useRef<any>(null);
  const ws = useRealtime();
  const { setSelectedFile } = useUI();

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      lineNumbers: "on",
      renderLineHighlight: "all",
      minimap: { enabled: false },
      padding: { top: 8, bottom: 8 },
      fontFamily: "'Roboto Mono', monospace",
      fontLigatures: false,
      fontSize: 13,
      fontWeight: "small",
      fontVariations: false,
      lineNumbersMinChars: 4,
      glyphMargin: false,
      lineDecorationsWidth: 10,
      "scrollbar": {
        "vertical": "auto",
        "horizontal": "auto",
        "verticalScrollbarSize": 14,
        "horizontalScrollbarSize": 12,
        "scrollByPage": false,
        "ignoreHorizontalScrollbarInContentHeight": false
      },
    });
  };

  // Update UI context when fileId changes
  useEffect(() => {
    if (fileId) {
      setSelectedFile(fileId);
    }
  }, [fileId, setSelectedFile]);

  // Keep internal state in sync when parent replaces content (e.g., switching files)
  // Only update if the content is actually different to avoid cursor jumping
  useEffect(() => {
    if (initialContent !== content) {
      setContent(initialContent);
      setSavedContent(initialContent);
      setIsDirty(false);
      // Only update the editor model if the content is significantly different
      // This prevents cursor jumping during normal typing
      if (editorRef.current && Math.abs(initialContent.length - content.length) > 10) {
        const model = editorRef.current.getModel?.();
        if (model && typeof model.setValue === 'function') {
          model.setValue(initialContent);
        }
      }
    }
  }, [initialContent, content]);

  const handleChange = (value: string | undefined) => {
    const newContent = value || '';
    setContent(newContent);
    setIsDirty(newContent !== savedContent);
    onContentChange?.(newContent);
  };

  const handleSave = async () => {
    if (!fileId || !isDirty || isSaving) return;
    
    setIsSaving(true);
    try {
      const result = await ws.writeFile(fileId, content, lastModified);
      if (result.success) {
        setSavedContent(content);
        setSavedMtime(result.current_mtime || null);
        setIsDirty(false);
        console.log('File saved successfully');
      } else if (result.conflict) {
        console.error('File conflict detected:', result.error);
        // Show conflict resolution UI
        const shouldOverwrite = window.confirm(
          `This file has been modified by another user. Do you want to overwrite their changes?\\n\\n${result.error}`
        );
        if (shouldOverwrite) {
          // Force save without timestamp check
          const forceResult = await ws.writeFile(fileId, content);
          if (forceResult.success) {
            setSavedContent(content);
            setSavedMtime(forceResult.current_mtime || null);
            setIsDirty(false);
            console.log('File force-saved successfully');
          }
        }
      } else {
        console.error('Failed to save file:', result.error);
        // Could show error toast here
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      // Could show error toast here
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    setContent(savedContent);
    setIsDirty(false);
    onContentChange?.(savedContent);
    // Update the editor model for reset
    if (editorRef.current) {
      const model = editorRef.current.getModel?.();
      if (model && typeof model.setValue === 'function') {
        model.setValue(savedContent);
      }
    }
  };

  // Listen for events from header
  useEffect(() => {
    const handleReset = () => {
      setContent(savedContent);
      setIsDirty(false);
      onContentChange?.(savedContent);
      if (editorRef.current) {
        const model = editorRef.current.getModel?.();
        if (model && typeof model.setValue === 'function') {
          model.setValue(savedContent);
        }
      }
    };

    const handleSaveFromHeader = async () => {
      await handleSave();
    };

    const handleRefreshFromHeader = () => {
      // Force reload the file content from the server
      if (fileId) {
        // Trigger parent component to reload file content
        window.dispatchEvent(new CustomEvent('code-editor-file-reload', { 
          detail: { fileId } 
        }));
      }
    };

    window.addEventListener('code-editor-reset', handleReset);
    window.addEventListener('code-editor-save', handleSaveFromHeader);
    window.addEventListener('code-editor-refresh', handleRefreshFromHeader);

    return () => {
      window.removeEventListener('code-editor-reset', handleReset);
      window.removeEventListener('code-editor-save', handleSaveFromHeader);
      window.removeEventListener('code-editor-refresh', handleRefreshFromHeader);
    };
  }, [savedContent, onContentChange, handleSave]);


  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Editor */}
      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0">
          <Editor
            height="100%"
            language={detectedLanguage}
            value={content}
            onChange={handleChange}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              lineNumbers: "on",
              renderLineHighlight: "all",
              minimap: { enabled: false },
              padding: { top: 8, bottom: 8 },
              fontFamily: "'Roboto Mono', monospace",
              fontLigatures: false,
              fontSize: 13,
              fontWeight: "small",
              fontVariations: false,
              lineNumbersMinChars: 4,
              glyphMargin: false,
              lineDecorationsWidth: 10,
              "scrollbar": {
                "vertical": "auto",
                "horizontal": "auto",
                "verticalScrollbarSize": 14,
                "horizontalScrollbarSize": 12,
                "scrollByPage": false,
                "ignoreHorizontalScrollbarInContentHeight": false
              },
            }}
            theme="vs-light"
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-600 bg-white border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] border border-blue-200">{displayLanguage}</span>
          <span className="text-gray-500">{content.split('\n').length} lines</span>
          <span className="text-gray-500">{content.length} characters</span>
          {/* Connection Status */}
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${ws.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[10px] text-gray-500">{ws.isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-2">
            {/* File Status Indicators */}
            {isSaving && (
              <div className="px-2 py-0.5 bg-blue-50 rounded-md text-blue-700 text-[10px] font-medium border border-blue-200">
                Saving...
              </div>
            )}
            {isDirty && !isSaving && (
              <div className="px-2 py-0.5 bg-amber-50 rounded-md text-amber-700 text-[10px] font-medium border border-amber-200">
                Unsaved changes
              </div>
            )}
            {!isDirty && !isSaving && (
              <div className="px-2 py-0.5 bg-green-50 rounded-md text-green-700 text-[10px] font-medium border border-green-200">
                Saved
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}