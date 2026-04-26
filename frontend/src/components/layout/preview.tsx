'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Smartphone, Monitor, RotateCw, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealtime } from '@/context/realtime-context';

interface PreviewProps {
  chatId: string;
}

type ViewMode = 'editor' | 'preview';

interface BuildStatus {
  status: 'idle' | 'preparing' | 'checking_dependencies' | 'installing_dependencies' | 'compiling' | 'complete' | 'error';
  html?: string;
  error?: string;
  message?: string;
  details?: string;
  stats?: {
    js_size: number;
    css_size: number;
    html_size: number;
    dependencies_installed?: boolean;
  };
}

export function Preview({ chatId }: PreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [buildStatus, setBuildStatus] = useState<BuildStatus>({ status: 'idle' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Inspector mode removed; only hover highlighting remains
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [eventLog, setEventLog] = useState<Array<{ stage: string; message?: string; details?: string }>>([]);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [is404Error, setIs404Error] = useState(false);

  // Console errors state - only showing errors now
  interface ConsoleError {
    level: 'error';
    message: string;
    timestamp: string;
    url?: string;
    lineNo?: number;
    columnNo?: number;
  }
  const [consoleErrors, setConsoleErrors] = useState<ConsoleError[]>([]);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);

  // Hover overlay state
  const [hoverRect, setHoverRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [hoverMeta, setHoverMeta] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  // Quick Edit menu state
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [quickEditValue, setQuickEditValue] = useState('');
  const [quickEditMeta, setQuickEditMeta] = useState<string | null>(null);
  const [quickEditPos, setQuickEditPos] = useState<{ x: number; y: number } | null>(null);
  const quickEditInputRef = useRef<HTMLTextAreaElement>(null);
  
  const ws = useRealtime();
  const {
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
    // Add Vite-specific handlers
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
    // Add Vite-specific off handlers
    offPreviewViteBuildStart,
    offPreviewViteBuildComplete,
  } = ws;

  const getViewportDimensions = () => {
    switch (viewportSize) {
      case 'mobile':
        return { width: '375px', height: '100%' };
      case 'tablet':
        return { width: '768px', height: '100%' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  // Setup SSE event listeners for build events
  useEffect(() => {
    console.log('Preview: Setting up event handlers for chat:', chatId);
    console.log('Preview: WebSocket handler bindings prepared');

    const handleBuildStart = (data: any) => {
      console.log('Preview: Received preview_build_start:', data);
      if (data.chat_id === chatId) {
        console.log('Build started for chat:', chatId);
        setBuildStatus({ 
          status: 'preparing',
          message: 'Preparing build...'
        });
        setOverlayVisible(true);
        setEventLog((prev) => [...prev, { stage: 'build_start', message: 'Preparing build...' }]);
      }
    };

    const handleDependencyCheck = (data: any) => {
      console.log('Preview: Received preview_dependency_check:', data);
      if (data.chat_id === chatId) {
        console.log('Dependency check for chat:', chatId);
        setBuildStatus({ 
          status: 'checking_dependencies',
          message: data.message || 'Checking dependencies...'
        });
        setEventLog((prev) => [...prev, { stage: 'dependency_check', message: data.message }]);
      }
    };

    const handleDependencyCheckComplete = (data: any) => {
      console.log('Preview: Received preview_dependency_check_complete:', data);
      if (data.chat_id === chatId) {
        setBuildStatus({
          status: 'checking_dependencies',
          message: data.message || 'Dependencies already installed'
        });
        setEventLog((prev) => [...prev, { stage: 'dependency_check_complete', message: data.message }]);
      }
    };

    const handleDependencyInstallStart = (data: any) => {
      console.log('Preview: Received preview_dependency_install_start:', data);
      if (data.chat_id === chatId) {
        console.log('Installing dependencies for chat:', chatId);
        setBuildStatus({ 
          status: 'installing_dependencies',
          message: data.message || 'Installing dependencies...',
          details: data.details
        });
        setEventLog((prev) => [...prev, { stage: 'dependency_install_start', message: data.message, details: data.details }]);
      }
    };

    const handleDependencyInstallComplete = (data: any) => {
      console.log('Preview: Received preview_dependency_install_complete:', data);
      if (data.chat_id === chatId) {
        console.log('Dependencies installed for chat:', chatId);
        setBuildStatus({ 
          status: 'compiling',
          message: data.message || 'Dependencies installed'
        });
        setEventLog((prev) => [...prev, { stage: 'dependency_install_complete', message: data.message }]);
      }
    };

    const handleBuildCompileStart = (data: any) => {
      console.log('Preview: Received preview_build_compile_start:', data);
      if (data.chat_id === chatId) {
        console.log('Compilation started for chat:', chatId);
        setBuildStatus({ 
          status: 'compiling',
          message: data.message || 'Compiling React application...',
          details: data.details
        });
        setEventLog((prev) => [...prev, { stage: 'build_compile_start', message: data.message, details: data.details }]);
      }
    };

    const handleBuildCompileComplete = (data: any) => {
      console.log('Preview: Received preview_build_compile_complete:', data);
      if (data.chat_id === chatId) {
        console.log('Compilation completed for chat:', chatId);
        setBuildStatus({ 
          status: 'compiling',
          message: data.message || 'Compilation successful',
          details: data.details
        });
        setEventLog((prev) => [...prev, { stage: 'build_compile_complete', message: data.message, details: data.details }]);
      }
    };

    const handleViteBuildStart = (data: any) => {
      console.log('Preview: Received preview_vite_build_start:', data);
      if (data.chat_id === chatId) {
        console.log('Vite build started for chat:', chatId);
        setBuildStatus({ 
          status: 'compiling',
          message: data.message || 'Building with Vite...',
          details: data.details
        });
        setEventLog((prev) => [...prev, { stage: 'vite_build_start', message: data.message, details: data.details }]);
      }
    };

    const handleViteBuildComplete = (data: any) => {
      console.log('Preview: Received preview_vite_build_complete:', data);
      if (data.chat_id === chatId) {
        console.log('Vite build completed for chat:', chatId);
        setBuildStatus({ 
          status: 'compiling',
          message: data.message || 'Vite build completed successfully',
          details: data.details
        });
        setEventLog((prev) => [...prev, { stage: 'vite_build_complete', message: data.message, details: data.details }]);
      }
    };

    const handleBuildHtmlComplete = (data: any) => {
      console.log('Preview: Received preview_build_html_complete:', data);
      if (data.chat_id === chatId) {
        console.log('HTML generation completed for chat:', chatId);
        setBuildStatus({ 
          status: 'compiling',
          message: data.message || 'HTML bundle generated',
          details: data.details
        });
        setEventLog((prev) => [...prev, { stage: 'build_html_complete', message: data.message, details: data.details }]);
      }
    };

    const handleBuildComplete = (data: any) => {
      console.log('🎉 Preview: handleBuildComplete CALLED!', data);
      if (data.chat_id === chatId) {
        console.log('✅ Build completed for matching chat:', chatId);
        console.log('✅ Public HTML path:', data.public_html_path);
        console.log('🔄 Setting buildStatus to complete...');
        setBuildStatus({
          status: 'complete',
          stats: data.stats,
          message: 'Build completed successfully!'
        });
        setEventLog((prev) => [...prev, { stage: 'build_complete', message: 'Build saved to public/index.html' }]);
        setOverlayVisible(false);
        console.log('✅ buildStatus updated to complete');
        
        // Auto-load preview after successful build with a small delay to ensure backend is ready
        console.log('🎯 Auto-loading preview after build completion...');
        setTimeout(() => {
          handleRefreshPreview();
        }, 500);
      } else {
        console.log('❌ Build complete for different chat:', data.chat_id, 'expected:', chatId);
      }
    };

    const handleBuildError = (data: any) => {
      console.log('Preview: Received preview_build_error:', data);
      if (data.chat_id === chatId) {
        console.error('Build error for chat:', chatId, data.error);
        // Extract useful details from multiple possible shapes
        let details: string | undefined;
        if (typeof data.details === 'string') {
          details = data.details;
        } else if (data.details && typeof data.details === 'object') {
          details =
            data.details.traceback ||
            data.details.stderr_tail ||
            data.details.stdout_tail ||
            data.details.stderr ||
            data.details.stdout ||
            undefined;
          if (!details) {
            try {
              details = JSON.stringify(data.details, null, 2);
            } catch (e) {
              details = undefined;
            }
          }
        }
        setBuildStatus({
          status: 'error',
          error: data.error,
          message: 'Build failed',
          details
        });
        setEventLog((prev) => [...prev, { stage: 'build_error', message: data.error, details }]);
        setOverlayVisible(true);
      }
    };

    // Register all SSE event listeners
    console.log('Preview: Registering event handlers...');
    
    // Add generic fallback for any missing build events
    const handleGenericBuildEvent = (eventName: string) => (data: any) => {
      console.log(`Preview: Received ${eventName}:`, data);
      if (data.chat_id === chatId) {
        console.log(`Generic build event ${eventName} for chat:`, chatId);
        
        // Determine status based on event name
        let status: 'preparing' | 'checking_dependencies' | 'installing_dependencies' | 'compiling' = 'compiling';
        if (eventName.includes('dependency')) {
          status = 'checking_dependencies';
        } else if (eventName.includes('install')) {
          status = 'installing_dependencies';
        } else if (eventName.includes('vite') || eventName.includes('compile')) {
          status = 'compiling';
        }
        
        setBuildStatus({ 
          status,
          message: data.message || `${eventName.replace('preview_', '').replace('_', ' ')}...`,
          details: data.details
        });
        setEventLog((prev) => [...prev, { 
          stage: eventName.replace('preview_', ''), 
          message: data.message, 
          details: data.details 
        }]);
      }
    };
    
    try {
      if (onPreviewBuildStart) {
        onPreviewBuildStart(handleBuildStart);
        console.log('Preview: Registered onPreviewBuildStart');
      } else {
        console.warn('Preview: onPreviewBuildStart not available');
      }
      
      if (onPreviewDependencyCheck) {
        onPreviewDependencyCheck(handleDependencyCheck);
        console.log('Preview: Registered onPreviewDependencyCheck');
      } else {
        console.warn('Preview: onPreviewDependencyCheck not available');
      }
      
      if (onPreviewDependencyCheckComplete) {
        onPreviewDependencyCheckComplete(handleDependencyCheckComplete);
        console.log('Preview: Registered onPreviewDependencyCheckComplete');
      }
      
      if (onPreviewDependencyInstallStart) {
        onPreviewDependencyInstallStart(handleDependencyInstallStart);
        console.log('Preview: Registered onPreviewDependencyInstallStart');
      }
      
      if (onPreviewDependencyInstallComplete) {
        onPreviewDependencyInstallComplete(handleDependencyInstallComplete);
        console.log('Preview: Registered onPreviewDependencyInstallComplete');
      }
      
      if (onPreviewBuildCompileStart) {
        onPreviewBuildCompileStart(handleBuildCompileStart);
        console.log('Preview: Registered onPreviewBuildCompileStart');
      }
      
      if (onPreviewBuildCompileComplete) {
        onPreviewBuildCompileComplete(handleBuildCompileComplete);
        console.log('Preview: Registered onPreviewBuildCompileComplete');
      }
      
      if (onPreviewBuildHtmlComplete) {
        onPreviewBuildHtmlComplete(handleBuildHtmlComplete);
        console.log('Preview: Registered onPreviewBuildHtmlComplete');
      }
      
      if (onPreviewBuildComplete) {
        onPreviewBuildComplete(handleBuildComplete);
        console.log('Preview: Registered onPreviewBuildComplete');
      } else {
        console.warn('Preview: onPreviewBuildComplete not available - THIS IS CRITICAL!');
      }
      
      if (onPreviewBuildError) {
        onPreviewBuildError(handleBuildError);
        console.log('Preview: Registered onPreviewBuildError');
      }
      
      // Register Vite-specific handlers 
      if (onPreviewViteBuildStart) {
        onPreviewViteBuildStart(handleViteBuildStart);
        console.log('Preview: Registered onPreviewViteBuildStart');
      } else {
        console.warn('Preview: onPreviewViteBuildStart not available');
      }
      
      if (onPreviewViteBuildComplete) {
        onPreviewViteBuildComplete(handleViteBuildComplete);
        console.log('Preview: Registered onPreviewViteBuildComplete');
      } else {
        console.warn('Preview: onPreviewViteBuildComplete not available');
      }
      
      console.log('Preview: All event handlers registered successfully');
    } catch (error) {
      console.error('Preview: Error registering event handlers:', error);
    }

    return () => {
      console.log('Preview: Cleaning up event handlers for chat:', chatId);
      offPreviewBuildStart?.(handleBuildStart);
      offPreviewDependencyCheck?.(handleDependencyCheck);
      offPreviewDependencyCheckComplete?.(handleDependencyCheckComplete);
      offPreviewDependencyInstallStart?.(handleDependencyInstallStart);
      offPreviewDependencyInstallComplete?.(handleDependencyInstallComplete);
      offPreviewBuildCompileStart?.(handleBuildCompileStart);
      offPreviewBuildCompileComplete?.(handleBuildCompileComplete);
      offPreviewBuildHtmlComplete?.(handleBuildHtmlComplete);
      offPreviewBuildComplete?.(handleBuildComplete);
      offPreviewBuildError?.(handleBuildError);
      
      // Cleanup Vite-specific handlers
      if (offPreviewViteBuildStart) {
        offPreviewViteBuildStart(handleViteBuildStart);
      }
      
      if (offPreviewViteBuildComplete) {
        offPreviewViteBuildComplete(handleViteBuildComplete);
      }
    };
  }, [
    chatId,
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
  ]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (iframeUrl && iframeUrl.startsWith('blob:')) {
        console.log('🧹 Preview: Cleaning up blob URL on unmount:', iframeUrl);
        URL.revokeObjectURL(iframeUrl);
      }
    };
  }, [iframeUrl]);

  // Listen for route updates from iframe (posted by injected script)
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as any;
      if (data && data.type === 'doxii-route') {
        const rawUrl = data.href || data.path || '';
        
        // Extract relative path from full URL
        let relativeRoute = '/';
        try {
          if (rawUrl) {
            // Check if it's a full URL
            if (rawUrl.startsWith('http')) {
              const url = new URL(rawUrl);
              // Extract path after the preview base path
              const previewBasePath = `/preview/${chatId}`;
              if (url.pathname.startsWith(previewBasePath)) {
                relativeRoute = url.pathname.substring(previewBasePath.length) || '/';
                // Also include search params if present
                if (url.search) {
                  // Check for ?path= parameter which is our routing convention
                  const pathParam = url.searchParams.get('path');
                  if (pathParam) {
                    relativeRoute = pathParam.startsWith('/') ? pathParam : `/${pathParam}`;
                  } else {
                    relativeRoute += url.search;
                  }
                }
              } else {
                relativeRoute = url.pathname;
              }
            } else {
              // It's already a relative path
              relativeRoute = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
            }
          }
        } catch (error) {
          console.warn('Error parsing route URL:', rawUrl, error);
          relativeRoute = rawUrl || '/';
        }
        
        setCurrentUrl(relativeRoute);
        setPreviewError(null); // Clear any previous error
        // Report current route to unified header
        window.dispatchEvent(new CustomEvent('preview-state-change', { 
          detail: { currentRoute: relativeRoute } 
        }));
      } else if (data && data.type === 'doxii-error') {
        // Handle 404 or other errors from iframe
        setPreviewError(data.message || 'Content not available');
        if (data.status === 404) {
          setIs404Error(true);
        } else {
          setIs404Error(false);
        }
      } else if (data && data.type === 'doxii-console-error') {
        // Handle console errors from iframe - only show actual errors, not warnings
        if (data.level === 'error') {
          const error: ConsoleError = {
            level: data.level || 'error',
            message: data.message || 'Unknown error',
            timestamp: data.timestamp || new Date().toISOString(),
            url: data.url,
            lineNo: data.lineNo,
            columnNo: data.columnNo,
          };
          setConsoleErrors(prev => {
            const newErrors = [...prev, error];
            // Keep only the last 10 errors
            return newErrors.slice(-10);
          });
          // Show overlay automatically on first error
          if (consoleErrors.length === 0) {
            setShowErrorOverlay(true);
          }
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [chatId]);

  // Handle hover messages from iframe for overlay
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as any;
      if (!data || !iframeRef.current || !iframeContainerRef.current) return;

      if (data.type === 'doxii-hover' && viewMode === 'preview' && visualEditMode) {
        try {
          const iframeBox = iframeRef.current.getBoundingClientRect();
          const containerBox = iframeContainerRef.current.getBoundingClientRect();
          const rect = data.rect || {};
          const meta = String(data.metadata || '');

          // Position overlay relative to the container that wraps the iframe
          const top = iframeBox.top + (rect.top || 0) - containerBox.top;
          const left = iframeBox.left + (rect.left || 0) - containerBox.left;
          const width = rect.width || 0;
          const height = rect.height || 0;

          setHoverRect({ top, left, width, height });
          setHoverMeta(meta);

          const mouseX = typeof data.mouseX === 'number' ? data.mouseX : 0;
          const mouseY = typeof data.mouseY === 'number' ? data.mouseY : 0;
          const tipX = iframeBox.left + mouseX - containerBox.left;
          const tipY = iframeBox.top + mouseY - containerBox.top;
          setTooltipPos({ x: tipX, y: tipY });
        } catch (e) {
          // no-op
        }
      } else if (data.type === 'doxii-hover-end') {
        setHoverRect(null);
        setHoverMeta(null);
        setTooltipPos(null);
      } else if (data.type === 'doxii-click' && viewMode === 'preview' && visualEditMode) {
        try {
          const iframeBox = iframeRef.current.getBoundingClientRect();
          const containerBox = iframeContainerRef.current.getBoundingClientRect();
          const rect = data.rect || {};
          const meta = String(data.metadata || '');
          // Smart menu positioning: right > left > below > above (clamped)
          const MENU_W = 320; // updated width for new styling
          const MENU_H = 200; // updated height for new styling
          const elemLeft = iframeBox.left + (rect.left || 0) - containerBox.left;
          const elemTop = iframeBox.top + (rect.top || 0) - containerBox.top;
          const elemRight = elemLeft + (rect.width || 0);
          const elemBottom = elemTop + (rect.height || 0);
          const containerW = containerBox.width;
          const containerH = containerBox.height;

          // Smart positioning with better priority
          const elemCenterX = elemLeft + (rect.width || 0) / 2;
          const candidates = [
            // Try to position near the clicked element first
            { x: elemRight + 12, y: elemTop - 20, name: 'right-near' },
            { x: elemLeft - MENU_W - 12, y: elemTop - 20, name: 'left-near' },
            { x: elemCenterX - MENU_W / 2, y: elemBottom + 12, name: 'below-center' },
            { x: elemCenterX - MENU_W / 2, y: elemTop - MENU_H - 12, name: 'above-center' },
            // Fallback to screen edges if near positioning doesn't work
            { x: containerW - MENU_W - 16, y: 16, name: 'top-right' },
            { x: 16, y: 16, name: 'top-left' },
            { x: containerW - MENU_W - 16, y: containerH - MENU_H - 16, name: 'bottom-right' },
            { x: 16, y: containerH - MENU_H - 16, name: 'bottom-left' },
          ];
          let chosen = candidates[0];
          for (const c of candidates) {
            const fitsX = c.x >= 8 && c.x + MENU_W <= containerW - 8;
            const fitsY = c.y >= 8 && c.y + MENU_H <= containerH - 8;
            if (fitsX && fitsY) { 
              chosen = c; 
              break; 
            }
          }
          const menuX = Math.min(Math.max(chosen.x, 8), Math.max(8, containerW - MENU_W - 8));
          const menuY = Math.min(Math.max(chosen.y, 8), Math.max(8, containerH - MENU_H - 8));
          setQuickEditMeta(meta);
          setQuickEditPos({ x: menuX, y: menuY });
          setQuickEditValue('');
          setQuickEditOpen(true);
          // Focus textarea next tick
          setTimeout(() => quickEditInputRef.current?.focus(), 0);
        } catch (e) {
          // no-op
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [viewMode, visualEditMode]);

  // Initialize hover system in iframe on load
  const postToIframe = (message: any) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(message, '*');
    } catch (e) {
      // no-op
    }
  };

  const handleIframeLoad = () => {
    // Initialize hover system but do not enable until toggled on
    postToIframe({ type: 'doxii-init-hover' });
    postToIframe({ type: visualEditMode ? 'doxii-hover-enable' : 'doxii-hover-disable' });
    setPreviewError(null); // Clear error on successful load
    setIs404Error(false); // Clear 404 error state on successful load
    
    // Auto-clear console errors when page loads successfully (errors are likely fixed)
    setConsoleErrors([]);
    setShowErrorOverlay(false);
  };

  const handleIframeError = () => {
    setPreviewError('Content preview not available');
    // Check if it's a 404 error by trying to fetch the current URL
    if (iframeUrl) {
      fetch(iframeUrl, { method: 'HEAD' })
        .then(response => {
          if (response.status === 404) {
            setIs404Error(true);
            setPreviewError('Page not found');
          }
        })
        .catch(() => {
          // Network error or other issue
          setIs404Error(false);
        });
    }
  };

  useEffect(() => {
    if (!iframeUrl) return;
    // Re-init when URL changes (e.g., new preview loaded)
    postToIframe({ type: 'doxii-init-hover' });
    postToIframe({ type: visualEditMode ? 'doxii-hover-enable' : 'doxii-hover-disable' });
  }, [iframeUrl]);

  // Enable/disable hover highlighting when toggled
  useEffect(() => {
    postToIframe({ type: visualEditMode ? 'doxii-hover-enable' : 'doxii-hover-disable' });
    if (!visualEditMode) {
      setHoverRect(null);
      setHoverMeta(null);
      setTooltipPos(null);
    }
  }, [visualEditMode]);

  // Submit Quick Edit prompt: send to chat with context, focus chat input, then close menu
  const submitQuickEdit = () => {
    if (!quickEditOpen || !quickEditMeta) return;
    const [filePath, lineStr, colStr] = quickEditMeta.split(':');
    const line = lineStr ? parseInt(lineStr, 10) : undefined;
    const col = colStr ? parseInt(colStr, 10) : undefined;
    const contextText = `File: ${filePath}${line ? `\nLine: ${line}` : ''}${col ? `, Column: ${col}` : ''}`;
    const userText = quickEditValue.trim();
    const combined = userText ? `${userText}\n\n${contextText}` : contextText;
    // Prefill and submit the chat input so the user sees it added
    window.dispatchEvent(new CustomEvent('prefill-chat-input', { detail: { text: combined } }));
    // Ensure submit happens after prefill focus
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('submit-chat-input', { detail: { text: combined } }));
    }, 50);
    setQuickEditOpen(false);
  };

  // Handle console error actions
  const handleCopyErrors = async () => {
    const errorText = consoleErrors.map(error => {
      const timestamp = new Date(error.timestamp).toLocaleTimeString();
      const location = error.url && error.lineNo ? ` at ${error.url}:${error.lineNo}:${error.columnNo || 0}` : '';
      return `[${timestamp}] ${error.level.toUpperCase()}: ${error.message}${location}`;
    }).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(errorText);
    } catch (err) {
      console.error('Failed to copy error text', err);
    }
  };

  const handleFixInChat = () => {
    const errorText = consoleErrors.map(error => {
      const timestamp = new Date(error.timestamp).toLocaleTimeString();
      const location = error.url && error.lineNo ? ` at ${error.url}:${error.lineNo}:${error.columnNo || 0}` : '';
      return `[${timestamp}] ${error.level.toUpperCase()}: ${error.message}${location}`;
    }).join('\n\n');
    
    const prompt = `Fix the following JavaScript console errors in the preview:\n\n${errorText}`;
    
    // Prefill and submit the chat input
    window.dispatchEvent(new CustomEvent('prefill-chat-input', { detail: { text: prompt } }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('submit-chat-input', { detail: { text: prompt } }));
    }, 50);
    
    setShowErrorOverlay(false);
  };

  // Auto-load preview on component mount - immediately load dist if available
  useEffect(() => {
    if (!iframeUrl) {
      handleRefreshPreview();
    }
  }, []); // Run only on mount

  // Auto-load preview when switching to preview mode
  useEffect(() => {
    if (viewMode === 'preview' && !iframeUrl) {
      handleRefreshPreview();
    }
  }, [viewMode]);

  // No inspection/select actions in simplified hover-only mode

  // Handle manual build trigger
  const handleBuild = () => {
    console.log('Manual build triggered for chat:', chatId);
    setBuildStatus({ status: 'preparing', message: 'Starting build...' });
    setOverlayVisible(true);
    setEventLog([]);
    // Disable visual edit mode while rebuilding
    setVisualEditMode(false);
    // Clear any active overlays/menus
    setHoverRect(null);
    setHoverMeta(null);
    setTooltipPos(null);
    setQuickEditOpen(false);
    
    // Send manual build request via SSE
    ws.sendManualBuild();
  };

  // Handle refresh preview (use direct endpoint URL instead of blob)
  const handleRefreshPreview = useCallback(async () => {
    console.log('🔄 handleRefreshPreview called for chat:', chatId);
    // Simplified for Lit: backend handles base path injection and fallbacks
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    
    // Always reset to homepage (/) on refresh
    const cleanPath = '/';
    
    // Add multiple cache-busting parameters to ensure fresh content
    const cacheBuster = Date.now();
    const randomBuster = Math.random().toString(36).substring(7);
    const previewUrl = `${apiUrl}/preview/${chatId}?_cb=${cacheBuster}&_rb=${randomBuster}`;

    // Clean up old blob URL if exists
    if (iframeUrl && iframeUrl.startsWith('blob:')) {
      try { URL.revokeObjectURL(iframeUrl); } catch {}
    }

    // Force iframe to clear cache by setting src to empty first, then to new URL
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
      // Small delay to ensure the blank load completes
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Reset current URL to homepage
    setCurrentUrl('/');
    setIframeUrl(previewUrl);
    setBuildStatus({ status: 'complete', message: 'Preview loaded' });
    window.dispatchEvent(new CustomEvent('preview-state-change', { detail: { currentRoute: '/' } }));
    setViewMode('preview');
    setOverlayVisible(false);
    console.log('✅ Preview refresh completed, URL set to:', previewUrl);
  }, [chatId, iframeUrl]);

  const renderPreviewContent = () => {
    console.log('Preview: renderPreviewContent called', { 
      status: buildStatus.status, 
      viewMode,
      iframeUrl: !!iframeUrl 
    });
    
    // Preview mode: Only show iframe if we have content
    if (viewMode === 'preview') {
      if (iframeUrl) {
        console.log('Preview: Rendering preview mode iframe');
        const dimensions = getViewportDimensions();
        return (
          <div
            ref={iframeContainerRef}
            className={`w-full h-full overflow-hidden relative ${isFullscreen && viewportSize !== 'desktop' ? 'flex items-center justify-center' : ''}`}
            onMouseLeave={() => {
              // Hide highlight and tooltip when pointer leaves preview area
              if (!quickEditOpen) {
                setHoverRect(null);
                setHoverMeta(null);
                setTooltipPos(null);
              }
              postToIframe({ type: 'doxii-hover-disable' });
            }}
            onMouseEnter={() => {
              if (visualEditMode && !quickEditOpen) {
                postToIframe({ type: 'doxii-hover-enable' });
              }
            }}
          >
            {previewError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  {is404Error ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Preview not available
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 max-w-md">
                        The page you're looking for doesn't exist yet.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {previewError}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        The preview could not be loaded. Please try refreshing or check for build errors.
                      </p>
                      <button
                        onClick={() => {
                          setPreviewError(null);
                          setIs404Error(false);
                          handleRefreshPreview();
                        }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                className="border-0 bg-white"
                style={
                  isFullscreen 
                    ? (viewportSize === 'desktop' 
                        ? { width: '100%', height: '100%' }
                        : { ...dimensions, maxWidth: '100vw', maxHeight: '100vh' }
                      )
                    : (viewportSize !== 'desktop' 
                        ? { ...dimensions, width: dimensions.width, height: dimensions.height } 
                        : { width: '100%', height: '100%' }
                      )
                }
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            )}
            
            {/* Hover highlight overlay and tooltip */}
            {visualEditMode && hoverRect && (
              <div
                className="absolute pointer-events-none z-40"
                style={{
                  top: hoverRect.top,
                  left: hoverRect.left,
                  width: hoverRect.width,
                  height: hoverRect.height,
                  border: '2px solid #3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.5) inset'
                }}
              />
            )}
            {visualEditMode && hoverMeta && tooltipPos && !quickEditOpen && (
              <div
                className="absolute z-50 pointer-events-none px-2 py-1 rounded text-[11px] bg-black/80 text-white max-w-[70%] truncate"
                style={{ top: tooltipPos.y + 8, left: tooltipPos.x + 8 }}
                title={hoverMeta}
              >
                {hoverMeta}
                  </div>
            )}

            {/* Quick Edit menu - Lightweight overlay */}
            {visualEditMode && quickEditOpen && quickEditPos && (
              <>
                {/* Subtle backdrop */}
                <div 
                  className="absolute inset-0 z-40 bg-black/5"
                  onClick={() => setQuickEditOpen(false)}
                />
                <div
                  className="absolute z-50 bg-white border border-gray-200 rounded-lg p-3 w-80 max-w-[320px]"
                  style={{ 
                    top: quickEditPos.y, 
                    left: quickEditPos.x
                  }}
                >
                  {/* Compact header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] text-gray-500 truncate pr-2 font-medium" title={quickEditMeta || ''}>
                      {quickEditMeta}
                    </div>
                    <button
                      className="h-5 w-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close"
                      onClick={() => setQuickEditOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Input area with message input styling */}
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                      <textarea
                        ref={quickEditInputRef}
                        value={quickEditValue}
                        onChange={(e) => setQuickEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submitQuickEdit();
                          } else if (e.key === 'Escape') {
                            setQuickEditOpen(false);
                          }
                        }}
                        rows={1}
                        placeholder="Describe the change you want..."
                        className="resize-y border-gray-200 shadow-sm rounded-xl px-4 py-2 min-h-10 h-10 max-h-40 overflow-auto text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 w-full"
                        style={{ 
                          fontSize: '14px', 
                          // height: '40px', 
                          // lineHeight: '1.25',
                          // paddingTop: '10px',
                          // paddingBottom: '10px',
                          // boxSizing: 'border-box',
                          // display: 'flex',
                          // alignItems: 'center'
                        }}
                      />
                      {/* Send button inside the textarea box, absolutely positioned */}
                      <button 
                        className="absolute bottom-2.5 right-2 h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white transition-all duration-200 flex items-center justify-center shrink-0"
                        onClick={submitQuickEdit}
                        title="Send (Enter)"
                        tabIndex={-1}
                        type="button"
                      >
                        <span className="flex items-center justify-center w-full h-full">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ transform: 'rotate(45deg)' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtle hint */}
                  <div className="text-[10px] text-gray-400 mt-1 text-center">
                    Press Enter to send, Esc to close
                  </div>
                </div>
              </>
            )}
            
            {/* Console Error Overlay */}
            {showErrorOverlay && consoleErrors.length > 0 && (
              <>
                <div 
                  className="absolute inset-0 z-40 bg-black/20"
                  onClick={() => setShowErrorOverlay(false)}
                />
                <div className="absolute top-4 right-4 left-4 sm:left-auto z-50 bg-white border border-red-200 rounded-lg shadow-lg max-w-md w-full sm:w-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h3 className="text-sm font-semibold text-gray-900">
                          Console Errors ({consoleErrors.length})
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowErrorOverlay(false)}
                        className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
                      {consoleErrors.slice(-5).map((error, idx) => (
                        <div key={idx} className="p-2 rounded text-xs bg-red-50 border border-red-200">
                          <div className="font-medium mb-1 text-red-800">
                            ERROR: {new Date(error.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="text-red-700">
                            {error.message}
                          </div>
                          {error.url && error.lineNo && (
                            <div className="text-gray-600 text-[10px] mt-1">
                              {error.url}:{error.lineNo}:{error.columnNo || 0}
                            </div>
                          )}
                        </div>
                      ))}
                      {consoleErrors.length > 5 && (
                        <div className="text-xs text-gray-500 text-center">
                          ... and {consoleErrors.length - 5} more errors
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyErrors}
                        className="flex-1 text-xs"
                      >
                        Copy errors
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleFixInChat}
                        className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white"
                      >
                        Fix in chat
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Error indicator when there are console errors but overlay is hidden */}
            {!showErrorOverlay && consoleErrors.length > 0 && (
              <button
                onClick={() => setShowErrorOverlay(true)}
                className="absolute top-4 right-4 z-30 bg-red-500 hover:bg-red-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg transition-colors"
                title={`${consoleErrors.length} console error${consoleErrors.length > 1 ? 's' : ''}`}
              >
                <AlertCircle className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {consoleErrors.length}
                </span>
              </button>
            )}
            
            {/* No selection indicator in simplified hover-only mode */}

            {/* Build Stats */}
            {buildStatus.stats && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md">
                JS: {Math.round(buildStatus.stats.js_size / 1024)}KB | 
                CSS: {Math.round(buildStatus.stats.css_size / 1024)}KB
                {buildStatus.stats.dependencies_installed && ' | Deps installed'}
              </div>
            )}
          </div>
        );
      } else {
        // No preview content available
        return (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Preview Available
            </h3>
            <p className="text-sm text-gray-600">
              Build and refresh the preview to view your React application.
            </p>
          </div>
        );
      }
    }
    
    // Editor mode: Show build status or instructions
    if (buildStatus.status === 'idle') {
      return (
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Build Available</h3>
          <p className="text-sm text-gray-600">Code not built yet. Click Build to compile, then Refresh Preview.</p>
        </div>
      );
    }

    if (['preparing', 'checking_dependencies', 'installing_dependencies', 'compiling'].includes(buildStatus.status)) {
      const getStatusIcon = () => {
        switch (buildStatus.status) {
          case 'preparing':
            return <RotateCw className="h-8 w-8 text-blue-600 animate-spin" />;
          case 'checking_dependencies':
            return <RotateCw className="h-8 w-8 text-purple-600 animate-spin" />;
          case 'installing_dependencies':
            return <RotateCw className="h-8 w-8 text-orange-600 animate-spin" />;
          case 'compiling':
            return <RotateCw className="h-8 w-8 text-yellow-600 animate-spin" />;
          default:
            return <RotateCw className="h-8 w-8 text-gray-600 animate-spin" />;
        }
      };

      const getStatusColor = () => {
        switch (buildStatus.status) {
          case 'preparing':
            return 'bg-blue-100';
          case 'checking_dependencies':
            return 'bg-purple-100';
          case 'installing_dependencies':
            return 'bg-orange-100';
          case 'compiling':
            return 'bg-yellow-100';
          default:
            return 'bg-gray-100';
        }
      };

      return (
        <div className="text-center p-6">
          <div className={`w-12 h-12 ${getStatusColor()} rounded-lg flex items-center justify-center mx-auto mb-3`}>
            {getStatusIcon()}
          </div>
          <div className="text-sm font-medium text-gray-900 mb-1">
            {buildStatus.message || 'Processing...'}
          </div>
          {buildStatus.details && (
            <div className="text-xs text-gray-600 mb-2">
              {buildStatus.details}
            </div>
          )}
          {eventLog.length > 0 && (
            <div className="text-[11px] text-gray-700 bg-white/90 border rounded-md p-3 max-w-lg mx-auto text-left">
              <div className="font-medium mb-1 text-gray-900">Build Progress:</div>
              {eventLog.slice(-6).map((e, idx) => (
                <div key={idx} className="py-0.5 flex items-start gap-2">
                  <span className="text-green-600 font-mono text-xs">✓</span>
                  <span className="flex-1 text-xs">
                    {e.stage.replaceAll('_', ' ').toUpperCase()}
                    {e.message ? (
                      <span className="text-gray-600 ml-1">- {e.message}</span>
                    ) : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (buildStatus.status === 'error') {
      const combinedErrorText = `${buildStatus.error || 'Build failed'}${buildStatus.details ? `\n\nDetails:\n${buildStatus.details}` : ''}`;
      const handleCopyError = async () => {
        try {
          await navigator.clipboard.writeText(combinedErrorText);
        } catch (err) {
          console.error('Failed to copy error text', err);
        }
      };
      const handleFixInChat = () => {
        const prompt = `Fix the following build error:\n\n${combinedErrorText}`;
        // Prefill chat textarea via custom event; UI will not auto-send
        window.dispatchEvent(new CustomEvent('prefill-chat-input', { detail: { text: prompt } }));
      };
      return (
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Build Error
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            There was an error building your React application:
          </p>
          <div className="text-xs text-red-700 bg-red-50 rounded-lg p-3 max-w-md mx-auto">
            {buildStatus.error}
          </div>
          {buildStatus.details && (
            <div className="text-[11px] text-gray-700 bg-gray-50 border rounded-lg p-3 max-w-md mx-auto mt-2 text-left overflow-auto max-h-40 whitespace-pre-wrap break-words">
              {buildStatus.details}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyError}
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Copy error
            </Button>
            <Button
              size="sm"
              onClick={handleFixInChat}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Fix in chat
            </Button>
          </div>
        </div>
      );
    }

    if (buildStatus.status === 'complete') {
      // In editor mode, show build success but preview should auto-load
      return (
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Build Complete!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Your React application has been built and preview is loading...
          </p>
          {buildStatus.stats && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <div className="font-medium mb-1">Build Stats:</div>
              <div>JS: {Math.round(buildStatus.stats.js_size / 1024)}KB</div>
              <div>CSS: {Math.round(buildStatus.stats.css_size / 1024)}KB</div>
              {buildStatus.stats.dependencies_installed && <div>Dependencies installed</div>}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Listen for AI streaming completion to auto-refresh preview
  useEffect(() => {
    const handleStreamingComplete = () => {
      console.log('🔄 AI streaming completed, auto-refreshing preview...');
      // Small delay to ensure any file writes are completed
      setTimeout(() => {
        console.log('🔄 Executing auto-refresh after AI streaming completion');
        handleRefreshPreview();
      }, 1000);
    };

    console.log('🎯 Setting up auto-refresh listener for AI streaming completion');
    window.addEventListener('code-message-received', handleStreamingComplete);
    return () => {
      console.log('🧹 Cleaning up auto-refresh listener for AI streaming completion');
      window.removeEventListener('code-message-received', handleStreamingComplete);
    };
  }, [handleRefreshPreview]);

  // Listen to unified header events (build/refresh/viewport/edit/navigate/fullscreen)
  useEffect(() => {
    const onBuild = () => handleBuild();
    const onRefresh = () => handleRefreshPreview();
    const onSetViewport = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ size?: 'desktop' | 'mobile' | 'tablet' }>;
        const size = ce.detail?.size || 'desktop';
        setViewportSize(size);
      } catch {}
    };
    const onToggleEdit = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ enabled?: boolean }>;
        setVisualEditMode(Boolean(ce.detail?.enabled));
      } catch {}
    };
    const onFullscreen = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ enabled?: boolean }>;
        setIsFullscreen(Boolean(ce.detail?.enabled));
      } catch {}
    };
    const onNavigate = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ route?: string }>;
        const route = ce.detail?.route;
        if (route && iframeRef.current) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
          
          // Add cache-busting to navigation as well
          const cacheBuster = Date.now();
          const randomBuster = Math.random().toString(36).substring(7);
          let targetUrl = `${apiUrl}/preview/${chatId}?_cb=${cacheBuster}&_rb=${randomBuster}`;
          
          // Handle navigation to different routes
          if (route !== '/') {
            targetUrl += `&path=${encodeURIComponent(route)}`;
          }
          
          console.log('Navigating to route:', route, 'URL:', targetUrl);
          setIframeUrl(targetUrl);
          setCurrentUrl(route);
        }
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    };
    
    window.addEventListener('preview-build', onBuild as EventListener);
    window.addEventListener('preview-refresh', onRefresh as EventListener);
    window.addEventListener('preview-set-viewport', onSetViewport as EventListener);
    window.addEventListener('preview-toggle-edit', onToggleEdit as EventListener);
    window.addEventListener('preview-fullscreen', onFullscreen as EventListener);
    window.addEventListener('preview-navigate', onNavigate as EventListener);
    return () => {
      window.removeEventListener('preview-build', onBuild as EventListener);
      window.removeEventListener('preview-refresh', onRefresh as EventListener);
      window.removeEventListener('preview-set-viewport', onSetViewport as EventListener);
      window.removeEventListener('preview-toggle-edit', onToggleEdit as EventListener);
      window.removeEventListener('preview-fullscreen', onFullscreen as EventListener);
      window.removeEventListener('preview-navigate', onNavigate as EventListener);
    };
  }, [handleBuild, handleRefreshPreview, chatId]);

  // Report state back to unified header for active button styling
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('preview-state-change', { 
      detail: { viewportSize, visualEditMode, currentRoute: currentUrl, isFullscreen } 
    }));
  }, [viewportSize, visualEditMode, currentUrl, isFullscreen]);

  // Handle escape key for fullscreen exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        window.dispatchEvent(new CustomEvent('preview-fullscreen', { detail: { enabled: false } }));
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  return (
    <div 
      style={{ 
        height: '100%', 
        width: '100%', 
        backgroundColor: isFullscreen ? '#000' : '#f9fafb', 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden'
      }}
      className={isFullscreen ? 'fixed inset-0 z-50' : ''}
    >
      {/* Fullscreen exit overlay - only visible in fullscreen */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-60">
          <button
            onClick={() => {
              setIsFullscreen(false);
              window.dispatchEvent(new CustomEvent('preview-fullscreen', { detail: { enabled: false } }));
            }}
            className="h-10 w-10 rounded-lg bg-black/70 hover:bg-black/80 text-white flex items-center justify-center transition-all duration-150 focus:outline-none shadow-lg backdrop-blur-sm"
            title="Exit Fullscreen (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-0">
        <div 
          className="relative bg-white border-0 flex items-center justify-center overflow-hidden"
          style={
            isFullscreen 
              ? { width: '100vw', height: '100vh' } 
              : (viewportSize === 'desktop' ? { width: '100%', height: '100%' } : getViewportDimensions())
          }
        >
          {/* Underlying content (iframe or placeholders) */}
          {renderPreviewContent()}

          {/* Progress Overlay */}
          {overlayVisible && buildStatus.status !== 'idle' && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="w-full max-w-md">
                {['preparing','checking_dependencies','installing_dependencies','compiling'].includes(buildStatus.status) && (
                  <div className="text-center">
                    <div className="mb-3 text-sm font-medium text-gray-900">Building preview…</div>
                    <div className="text-xs text-gray-600 mb-2">{buildStatus.message}</div>
                    {eventLog.length > 0 && (
                      <div className="text-[11px] text-gray-700 bg-white/95 border rounded-md p-3 mx-auto max-w-lg text-left shadow-sm">
                        <div className="font-medium mb-2 text-gray-900 text-xs">Build Steps:</div>
                        {eventLog.slice(-6).map((e, i) => (
                          <div key={i} className="py-0.5 flex items-start gap-2">
                            <span className="text-blue-600 font-mono text-xs">•</span>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-900">
                                {e.stage.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                              {e.message && (
                                <div className="text-xs text-gray-600 mt-0.5">{e.message}</div>
                              )}
                              {e.details && (
                                <div className="text-xs text-gray-500 mt-0.5 font-mono">{e.details}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {buildStatus.status === 'error' && (
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-red-700">Build failed</div>
                    <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2 mx-auto max-w-md">{buildStatus.error}</div>
                    {buildStatus.details && (
                      <div className="text-[11px] text-gray-700 bg-gray-50 border rounded-md p-2 mx-auto max-w-md mt-2 text-left overflow-auto max-h-40 whitespace-pre-wrap break-words">
                        {buildStatus.details}
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const combined = `${buildStatus.error || 'Build failed'}${buildStatus.details ? `\n\nDetails:\n${buildStatus.details}` : ''}`;
                          try { await navigator.clipboard.writeText(combined); } catch (e) { console.error('Copy failed', e); }
                        }}
                      >
                        Copy error
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const combined = `${buildStatus.error || 'Build failed'}${buildStatus.details ? `\n\nDetails:\n${buildStatus.details}` : ''}`;
                          const prompt = `The preview build failed. Here is the full error output. Please analyze and provide concrete code edits to fix it.\n\n${combined}`;
                          ws.sendAIMessage(prompt);
                        }}
                      >
                        Fix in chat
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

