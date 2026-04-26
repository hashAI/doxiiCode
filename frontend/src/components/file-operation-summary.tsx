'use client';

import { FileText, PlusCircle, Pencil, FolderOpen, List, Search, AlertCircle } from 'lucide-react';

interface FileOperationSummaryProps {
  content: string;
}

interface ParsedFileOperation {
  fileName: string;
  status: 'Created' | 'Edited' | 'Read' | 'No changes made';
  diffInfo?: string;
  isError?: boolean;
}

function parseFileOperation(content: string): ParsedFileOperation | null {
  // Handle error messages
  if (content.startsWith('❌')) {
    return {
      fileName: content.replace('❌', '').trim(),
      status: 'Read',
      isError: true
    };
  }
  
  // Handle non-file operations (summary messages)
  if (content.startsWith('📂') || content.startsWith('🔍') || !content.startsWith('●')) {
    return null; // These will be handled as summary messages
  }
  
  // Parse new v0.dev style: "● components/style-guide-generator.tsx - Created (+45 lines)"
  const fileMatch = content.match(/●\s+(.+?)\s+-\s+(.+?)(?:\s+\((.+?)\))?$/);
  
  if (!fileMatch) {
    return null;
  }

  const [, fileName, statusPart] = fileMatch;
  
  // Extract status and diff info
  let status: 'Created' | 'Edited' | 'Read' | 'No changes made' = 'Read';
  let diffInfo: string | undefined;
  
  // Look for diff info in parentheses within the status part
  const diffMatch = statusPart.match(/\(([^)]+)\)/);
  if (diffMatch) {
    const diffText = diffMatch[1];
    if (diffText.includes('+') && diffText.includes('-')) {
      diffInfo = diffText.replace(' lines', '');
    } else if (diffText.includes('+')) {
      diffInfo = diffText.replace(' lines', '');
    }
  }
  
  // Determine status
  if (statusPart.includes('Created')) {
    status = 'Created';
  } else if (statusPart.includes('Edited')) {
    status = 'Edited';
  } else if (statusPart.includes('No changes made')) {
    status = 'No changes made';
  } else if (statusPart.includes('Read')) {
    status = 'Read';
  }
  
  return {
    fileName: fileName.trim(),
    status,
    diffInfo,
    isError: false
  };
}

function FileOperationItem({ operation }: { operation: string }) {
  const parsed = parseFileOperation(operation);
  
  // If it's not a file operation, return as a simple status message (Cursor style)
  if (!parsed) {
    const isListLike = operation.startsWith('📂') || operation.toLowerCase().includes('list');
    const isSearchLike = operation.startsWith('🔍') || operation.toLowerCase().includes('search');
    const isError = operation.startsWith('❌');
    return (
      <div className="flex items-center gap-2 py-1 px-0 text-[13px]">
        {isError ? (
          <AlertCircle className="h-3.5 w-3.5 text-red-500" />
        ) : isListLike ? (
          <List className="h-3.5 w-3.5 text-blue-600" />
        ) : isSearchLike ? (
          <Search className="h-3.5 w-3.5 text-blue-600" />
        ) : (
          <FileText className="h-3.5 w-3.5 text-blue-600" />
        )}
        <div className="text-[13px] text-slate-700">
          {operation}
        </div>
      </div>
    );
  }

  const getChangeIndicator = () => {
    if (parsed.isError) {
      return <span className="text-red-500 text-[12px] font-medium">×</span>;
    }
    
    if (parsed.diffInfo) {
      // Extract numbers from diffInfo like "+20 -5"
      const addMatch = parsed.diffInfo.match(/\+(\d+)/);
      const removeMatch = parsed.diffInfo.match(/-(\d+)/);
      
      if (addMatch && removeMatch) {
        return <span className="text-emerald-500 text-[12px] font-medium">+{addMatch[1]} <span className="text-red-500">-{removeMatch[1]}</span></span>;
      } else if (addMatch) {
        return <span className="text-emerald-500 text-[12px] font-medium">+{addMatch[1]}</span>;
      }
    }
    
    // Simple status indicators
    switch (parsed.status) {
      case 'Created':
        return <span className="text-emerald-500 text-[12px]">+</span>;
      case 'Edited':
        return <span className="text-blue-500 text-[12px]">~</span>;
      case 'Read':
        return <span className="text-slate-400 text-[12px]">•</span>;
      default:
        return <span className="text-slate-400 text-[12px]">•</span>;
    }
  };

  return (
    <div className="flex items-center gap-2 py-1 px-0 text-[13px]">
      {parsed.status === 'Created' ? (
        <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
      ) : parsed.status === 'Edited' ? (
        <Pencil className="h-3.5 w-3.5 text-blue-600" />
      ) : parsed.status === 'No changes made' ? (
        <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
      ) : (
        <FileText className="h-3.5 w-3.5 text-blue-600" />
      )}
      <span className="text-slate-700 flex-1 min-w-0 truncate" title={parsed.fileName}>
        {parsed.fileName}
      </span>
      {getChangeIndicator()}
    </div>
  );
}

export function FileOperationSummary({ content }: FileOperationSummaryProps) {
  // Split content by newlines to handle multiple operations
  const operations = content.split('\n').filter(op => op.trim());

  // Build counts for a compact header when we have multiple ops
  const parsed = operations.map(op => parseFileOperation(op));
  const createdCount = parsed.filter(p => p?.status === 'Created').length;
  const editedCount = parsed.filter(p => p?.status === 'Edited').length;
  const noChangeCount = parsed.filter(p => p?.status === 'No changes made').length;

  if (operations.length === 1) {
    return <FileOperationItem operation={operations[0]} />;
  }

  return (
    <div className="flex flex-col gap-0">
      {(createdCount + editedCount + noChangeCount) > 0 && (
        <div className="flex items-center gap-3 text-[12px] text-slate-600 mb-1">
          {createdCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
              <span>{createdCount} created</span>
            </span>
          )}
          {editedCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Pencil className="h-3.5 w-3.5 text-blue-600" />
              <span>{editedCount} modified</span>
            </span>
          )}
          {noChangeCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
              <span>{noChangeCount} unchanged</span>
            </span>
          )}
        </div>
      )}
      {operations.map((operation, index) => (
        <FileOperationItem key={index} operation={operation} />
      ))}
    </div>
  );
}