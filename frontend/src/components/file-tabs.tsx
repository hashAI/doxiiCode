'use client';

import { useState, useEffect } from 'react';
import { X, File } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/code-editor';
import { HTMLPreview } from '@/components/html-preview';
import { fetchChatFiles, fetchFile } from '@/lib/api';
import type { FileItem } from '@/lib/types';

interface FileTabsProps {
  chatId?: string;
  showPreview: boolean;
  onTogglePreview?: () => void;
}

interface OpenFile extends FileItem {
  content: string;
}

export function FileTabs({ chatId, showPreview, onTogglePreview }: FileTabsProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>();
  const [previewContent, setPreviewContent] = useState<string>('');

  useEffect(() => {
    if (chatId) {
      loadFiles();
    } else {
      setFiles([]);
      setOpenFiles([]);
      setActiveFileId(undefined);
    }
  }, [chatId]); // loadFiles is stable since it doesn't use dependencies

  const loadFiles = async () => {
    if (!chatId) return;
    
    try {
      const filesData = await fetchChatFiles(chatId);
      setFiles(filesData);
      
      // Auto-open the latest file if no files are open
      if (filesData.length > 0 && openFiles.length === 0) {
        openFile(filesData[0]);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const openFile = async (file: FileItem) => {
    // Check if file is already open
    const existingFile = openFiles.find(f => f.id === file.id);
    if (existingFile) {
      setActiveFileId(file.id);
      setPreviewContent(existingFile.content);
      return;
    }

    try {
      const fileData = await fetchFile(file.id);
      const openFile: OpenFile = {
        ...file,
        content: fileData.content,
      };
      
      setOpenFiles(prev => [...prev, openFile]);
      setActiveFileId(file.id);
      setPreviewContent(fileData.content);
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  };

  const closeFile = (fileId: string) => {
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (activeFileId === fileId) {
      const remaining = openFiles.filter(f => f.id !== fileId);
      if (remaining.length > 0) {
        setActiveFileId(remaining[0].id);
        setPreviewContent(remaining[0].content);
      } else {
        setActiveFileId(undefined);
        setPreviewContent('');
      }
    }
  };

  const handleContentChange = (content: string) => {
    setPreviewContent(content);
    
    // Update the content in openFiles
    setOpenFiles(prev => 
      prev.map(file => 
        file.id === activeFileId 
          ? { ...file, content }
          : file
      )
    );
  };


  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No chat selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* File list when no files are open */}
      {openFiles.length === 0 && (
        <div className="flex-1 p-4">
          <h3 className="text-lg font-medium mb-4">Files</h3>
          {files.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files in this chat yet</p>
              <p className="text-sm">Generate some HTML to create files</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <Button
                  key={file.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => openFile(file)}
                >
                  <File className="h-4 w-4 mr-2" />
                  {file.filename}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File tabs when files are open */}
      {openFiles.length > 0 && (
        <Tabs value={activeFileId} onValueChange={setActiveFileId} className="flex-1 flex flex-col">
          {/* Tab list */}
          <div className="border-b">
            <TabsList className="h-auto p-0 bg-transparent">
              {openFiles.map((file) => (
                <div key={file.id} className="flex items-center">
                  <TabsTrigger
                    value={file.id}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <File className="h-4 w-4 mr-2" />
                    {file.filename}
                  </TabsTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => closeFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </TabsList>
          </div>

          {/* Tab content */}
          <div className="flex-1 flex">
            {openFiles.map((file) => (
              <TabsContent key={file.id} value={file.id} className="flex-1 m-0">
                <div className="flex h-full">
                  <div className={showPreview ? "flex-1" : "w-full"}>
                    <CodeEditor
                      fileId={file.id}
                      initialContent={file.content}
                      onContentChange={handleContentChange}
                    />
                  </div>
                  {showPreview && (
                    <HTMLPreview
                      htmlContent={previewContent}
                      isVisible={true}
                    />
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}

      {/* Files list in sidebar when files exist but tabs are open */}
      {files.length > 0 && openFiles.length > 0 && (
        <div className="border-t p-2">
          <details className="group">
            <summary className="text-sm font-medium text-muted-foreground cursor-pointer py-2">
              All Files ({files.length})
            </summary>
            <div className="space-y-1 mt-2">
              {files.map((file) => (
                <Button
                  key={file.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => openFile(file)}
                >
                  <File className="h-3 w-3 mr-2" />
                  <span className="text-xs">{file.filename}</span>
                </Button>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}