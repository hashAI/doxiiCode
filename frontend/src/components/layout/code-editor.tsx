'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

export function CodeEditor() {
  return (
    <div className="h-full w-full min-h-0">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        defaultValue="// Start coding here..."
        theme="vs-dark"
      />
    </div>
  );
}

