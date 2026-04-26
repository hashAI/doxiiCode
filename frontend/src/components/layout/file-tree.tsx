'use client';

import React, { useState, useEffect } from 'react';
import { File, Folder, ChevronRight, ChevronDown, FileText, Settings, Code, Braces, FileIcon, Wifi, WifiOff, Search, X, SearchIcon } from 'lucide-react';
import { useRealtime } from '@/context/realtime-context';

interface FileTreeProps {
  chatId: string;
  onFileSelect?: (path: string, content: string, lastModified?: number) => void;
}

interface SearchResult {
  path: string;
  matches: Array<{
    line: number;
    content: string;
    matchStart: number;
    matchEnd: number;
  }>;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  icon?: React.ReactNode;
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jsx':
    case 'tsx':
      return <Code className="h-4 w-4 text-gray-500" />;
    case 'js':
    case 'ts':
      return <Braces className="h-4 w-4 text-gray-500" />;
    case 'json':
      return <Settings className="h-4 w-4 text-gray-500" />;
    case 'css':
      return <FileText className="h-4 w-4 text-gray-500" />;
    case 'html':
      return <FileText className="h-4 w-4 text-gray-500" />;
    case 'md':
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <FileIcon className="h-4 w-4 text-gray-400" />;
  }
};

const buildFileTree = (filePaths: string[]): FileNode[] => {
  const root: FileNode[] = [];
  const nodeMap = new Map<string, FileNode>();

  // Sort paths to ensure directories come before files
  const sortedPaths = filePaths.sort();

  for (const path of sortedPaths) {
    const parts = path.split('/');
    let currentPath = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!nodeMap.has(currentPath)) {
        const node: FileNode = {
          name: part,
          path: currentPath,
          type: isLast ? 'file' : 'directory',
          children: isLast ? undefined : [],
          icon: isLast ? getFileIcon(part) : <Folder className="h-4 w-4 text-gray-500" />
        };
        
        nodeMap.set(currentPath, node);
        
        if (i === 0) {
          root.push(node);
        } else {
          const parentPath = parts.slice(0, i).join('/');
          const parent = nodeMap.get(parentPath);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        }
      }
    }
  }
  
  return root;
};

function TreeNode({ node, onFileSelect, expanded, onToggle, wsService }: {
  node: FileNode;
  onFileSelect?: (path: string, content: string, lastModified?: number) => void;
  expanded: boolean;
  onToggle: () => void;
  wsService: any;
}) {
  const handleClick = async () => {
    if (node.type === 'directory') {
      onToggle();
    } else if (onFileSelect && wsService) {
      try {
        const result = await wsService.readFile(node.path);
        if (result.content !== undefined && !result.error) {
          onFileSelect(node.path, result.content, result.last_modified);
        } else {
          console.error('Failed to load file:', result.error);
        }
      } catch (error) {
        console.error('Failed to load file via SSE:', error);
      }
    }
  };

  return (
    <div>
      <div 
        className="flex items-center gap-1 px-2 py-1 text-sm cursor-pointer hover:bg-purple-50 rounded transition-colors"
        onClick={handleClick}
      >
        {node.type === 'directory' && (
          <span className="flex-shrink-0">
            {expanded ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </span>
        )}
        <span className="flex-shrink-0">{node.icon}</span>
        <span className="text-gray-700 truncate">{node.name}</span>
      </div>
      
      {node.type === 'directory' && expanded && node.children && (
        <div className="ml-4">
          {node.children.map((child) => (
            <TreeNodeContainer 
              key={child.path} 
              node={child} 
              onFileSelect={onFileSelect}
              wsService={wsService}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNodeContainer({ node, onFileSelect, wsService }: {
  node: FileNode;
  onFileSelect?: (path: string, content: string, lastModified?: number) => void;
  wsService: any;
}) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <TreeNode
      node={node}
      onFileSelect={onFileSelect}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      wsService={wsService}
    />
  );
}

export function FileTree({ chatId, onFileSelect }: FileTreeProps) {
  const ws = useRealtime();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [filteredTree, setFilteredTree] = useState<FileNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'files' | 'content'>('files');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
     if (ws.files.length > 0) {
      const filtered = ws.files.filter((p: string) => {
        const segments = p.split('/');
        if (segments.some(seg => seg.startsWith('.'))) return false;
        if (segments.includes('node_modules')) return false;
        if (segments.includes('dist') || segments.includes('build')) return false;
        return true;
      });
      const tree = buildFileTree(filtered);
      setFileTree(tree);
      setFilteredTree(tree);
    }
  }, [ws.files]);

  // Perform content search
  const searchInFileContent = async (query: string) => {
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results: SearchResult[] = [];
      
      // Get all text files for searching
      const textFiles = ws.files.filter((path: string) => {
        const ext = path.split('.').pop()?.toLowerCase();
        return ['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html', 'md', 'txt'].includes(ext || '');
      });

      for (const filePath of textFiles) {
        try {
          const result = await ws.readFile(filePath);
          if (result.content && !result.error) {
            const lines = result.content.split('\n');
            const matches = [];
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const lowerLine = line.toLowerCase();
              const lowerQuery = query.toLowerCase();
              
              let index = lowerLine.indexOf(lowerQuery);
              while (index !== -1) {
                matches.push({
                  line: i + 1,
                  content: line,
                  matchStart: index,
                  matchEnd: index + query.length
                });
                index = lowerLine.indexOf(lowerQuery, index + 1);
              }
            }
            
            if (matches.length > 0) {
              results.push({ path: filePath, matches });
            }
          }
        } catch (error) {
          console.error(`Error searching in file ${filePath}:`, error);
        }
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error during content search:', error);
    }
    
    setIsSearching(false);
  };

  // Filter tree based on search query and mode
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTree(fileTree);
      setSearchResults([]);
      return;
    }

    if (searchMode === 'files') {
      // Search file names
      const filterTree = (nodes: FileNode[]): FileNode[] => {
        return nodes.reduce((acc: FileNode[], node) => {
          const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              node.path.toLowerCase().includes(searchQuery.toLowerCase());
          
          if (node.type === 'file' && matchesSearch) {
            acc.push(node);
          } else if (node.type === 'directory') {
            const filteredChildren = node.children ? filterTree(node.children) : [];
            if (filteredChildren.length > 0 || matchesSearch) {
              acc.push({
                ...node,
                children: filteredChildren
              });
            }
          }
          return acc;
        }, []);
      };

      setFilteredTree(filterTree(fileTree));
      setSearchResults([]);
    } else {
      // Search in file content
      setFilteredTree(fileTree);
      searchInFileContent(searchQuery);
    }
  }, [searchQuery, fileTree, searchMode, ws]);

  // Handle VFS changes
  useEffect(() => {
    ws.onVFSChange((data) => {
      console.log(`File tree VFS change:`, data);
      // The files list will be automatically updated by the realtime context
    });
  }, [ws]);

  const handleFileSelect = async (path: string, content: string, lastModified?: number) => {
    if (onFileSelect) {
      // If content is empty (from search results), load it from the server
      if (!content) {
        try {
          const result = await ws.readFile(path);
          if (result.content !== undefined && !result.error) {
            onFileSelect(path, result.content, result.last_modified);
          } else {
            console.error('Failed to load file:', result.error);
          }
        } catch (error) {
          console.error('Failed to load file via SSE:', error);
        }
      } else {
        onFileSelect(path, content, lastModified);
      }
    }
  };

  if (!ws.isConnected) {
    return (
      <div className="flex h-full flex-col bg-white p-3">
        <div className="flex items-center gap-2 mb-3">
          <WifiOff className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-medium text-gray-700">Files (Disconnected)</h2>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center text-red-500">
            <div className="text-sm mb-1">WebSocket disconnected</div>
            <div className="text-xs">Reconnecting...</div>
          </div>
        </div>
      </div>
    );
  }

  if (ws.files.length === 0) {
    return (
      <div className="flex h-full flex-col bg-white p-3">
        <h2 className="mb-3 text-sm font-medium text-gray-700">Files</h2>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center text-gray-500">
            <div className="text-sm mb-1">No files yet</div>
            <div className="text-xs">Ask the AI to create your project (React or Lit)</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white p-3">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-medium text-gray-700">
          Files ({ws.files.length})
        </h2>
      </div>
      
      {/* Search Mode Toggle */}
      <div className="flex items-center gap-1 mb-2">
        <button
          onClick={() => setSearchMode('files')}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            searchMode === 'files' 
              ? 'bg-purple-50 text-gray-800 font-medium' 
              : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          Search Files
        </button>
        <button
          onClick={() => setSearchMode('content')}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            searchMode === 'content' 
              ? 'bg-purple-50 text-gray-800 font-medium' 
              : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          Search in files
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={searchMode === 'files' ? "Search files..." : "Search in files..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 bg-white transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-2 flex items-center hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5 text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Results count when searching */}
      {searchQuery && (
        <div className="text-xs text-gray-500 mb-2">
          {searchMode === 'content' ? (
            isSearching ? 'Searching...' : 
            searchResults.length === 0 ? 'No matches found' : 
            `${searchResults.reduce((total, result) => total + result.matches.length, 0)} matches in ${searchResults.length} file${searchResults.length === 1 ? '' : 's'}`
          ) : (
            filteredTree.length === 0 ? 'No files found' : `${filteredTree.length} result${filteredTree.length === 1 ? '' : 's'}`
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        {searchMode === 'content' && searchQuery && searchResults.length > 0 ? (
          // Show search results for content search
          <div className="space-y-2">
            {searchResults.map((result) => (
              <div key={result.path} className="border-l-2 border-gray-200 pl-2">
                <div 
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 flex items-center gap-2 mb-1"
                  onClick={() => handleFileSelect(result.path, '')}
                >
                  {getFileIcon(result.path.split('/').pop() || '')}
                  <span className="truncate">{result.path}</span>
                  <span className="text-xs text-gray-500">({result.matches.length})</span>
                </div>
                <div className="space-y-1 ml-6">
                  {result.matches.slice(0, 3).map((match, idx) => (
                    <div 
                      key={idx} 
                      className="text-xs bg-white p-2 rounded cursor-pointer hover:bg-purple-50"
                      onClick={() => handleFileSelect(result.path, '')}
                    >
                      <div className="text-gray-500 mb-1">Line {match.line}</div>
                      <div className="font-mono text-gray-700 truncate">
                        {match.content.substring(0, match.matchStart)}
                        <span className="bg-yellow-200 px-0.5">
                          {match.content.substring(match.matchStart, match.matchEnd)}
                        </span>
                        {match.content.substring(match.matchEnd)}
                      </div>
                    </div>
                  ))}
                  {result.matches.length > 3 && (
                    <div className="text-xs text-gray-500 ml-2">
                      +{result.matches.length - 3} more matches
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show file tree for file search or when no content search
          filteredTree.map((node) => (
            <TreeNodeContainer
              key={node.path}
              node={node}
              onFileSelect={handleFileSelect}
              wsService={ws}
            />
          ))
        )}
      </div>
    </div>
  );
}

