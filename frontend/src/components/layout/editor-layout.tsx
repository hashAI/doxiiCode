'use client';

import React, { useState, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FileText } from 'lucide-react';
import { FileTree } from './file-tree';
import { CodeEditor } from '../code-editor';
import { Preview } from './preview';
import { RealtimeProvider, useRealtime } from '@/context/realtime-context';
import { useUI } from '@/context/ui-context';

// View mode managed globally via UI context (code | preview)

interface EditorLayoutProps {
  chatId: string;
}

function EditorLayoutInner({ chatId }: { chatId: string }) {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileLastModified, setFileLastModified] = useState<number | undefined>();
  const { state, setMode, setSelectedFile } = useUI();
  const { currentMode, selectedFile } = state;
  const ws = useRealtime();

  const handleFileSelect = (path: string, content: string, lastModified?: number) => {
    setSelectedFile(path);
    setFileContent(content);
    setFileName(path.split('/').pop() || path);
    setFileLastModified(lastModified);
  };

  const renderMainContent = () => {
    if (!selectedFile) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <div className="text-lg mb-2">No file selected</div>
            <div className="text-sm">Select a file from the project tree to start editing</div>
          </div>
        </div>
      );
    }

    if (currentMode === 'code') {
      return (
        <CodeEditor 
          initialContent={fileContent}
          filename={fileName}
          fileId={selectedFile}
          lastModified={fileLastModified}
          readOnly={false}
        />
      );
    }
    
    if (currentMode === 'preview') {
      return <Preview chatId={chatId} />;
    }
    // Default to code view
    return <Preview chatId={chatId} />;
  };

  return (
    <PanelGroup direction="horizontal" className="flex-1">
      <Panel defaultSize={20} minSize={15} maxSize={40}>
        <FileTree chatId={chatId} onFileSelect={handleFileSelect} />
      </Panel>
      <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize" />
      <Panel>
        <div className="h-full overflow-hidden">
          {renderMainContent()}
        </div>
      </Panel>
    </PanelGroup>
  );
}

export function EditorLayout({ chatId }: EditorLayoutProps) {
  return (
    <RealtimeProvider chatId={chatId} autoConnect={true}>
      <EditorLayoutInner chatId={chatId} />
    </RealtimeProvider>
  );
}

