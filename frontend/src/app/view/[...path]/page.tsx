'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ComponentViewPage() {
  const params = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const componentLoadedRef = useRef<string>('');
  
  // Get the path from params (array of path segments)
  const pathSegments = params.path as string[];
  const componentPath = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
  
  // Extract element tag from the file path (filename without extension)
  const getElementTag = (filePath: string): string => {
    const parts = filePath.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace(/\.(js|mjs)$/, '');
  };
  
  const elementTag = componentPath ? getElementTag(componentPath) : '';
  const filePath = componentPath ? `component_library/components/${componentPath}` : '';
  const componentKey = `${elementTag}-${filePath}`;
  
  // Listen for preview-ready message from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the preview iframe
      if (event.data?.type === 'preview-ready') {
        setIsReady(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Fallback: if preview-ready message doesn't arrive within 2 seconds,
    // assume the iframe is ready (in case of CORS or timing issues)
    const fallbackTimeout = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallbackTimeout);
    };
  }, []);
  
  // Reset ready state when component path changes
  useEffect(() => {
    setIsReady(false);
    componentLoadedRef.current = '';
    
    // If iframe is already loaded, mark as ready after a short delay
    // (since the iframe src doesn't change, it won't send a new preview-ready message)
    const iframe = iframeRef.current;
    if (iframe?.contentDocument?.readyState === 'complete') {
      const timeoutId = setTimeout(() => {
        setIsReady(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [componentPath]);
  
  // Send load-component message when preview is ready
  useEffect(() => {
    if (!isReady || !iframeRef.current || !elementTag || !filePath) {
      return;
    }
    
    // Don't reload if we've already loaded this component
    if (componentLoadedRef.current === componentKey) {
      return;
    }
    
    const iframe = iframeRef.current;
    
    // Send message to load component
    const sendLoadMessage = () => {
      if (iframe.contentWindow) {
        componentLoadedRef.current = componentKey;
        iframe.contentWindow.postMessage(
          {
            type: 'load-component',
            elementTag: elementTag,
            filePath: filePath,
          },
          '*'
        );
      }
    };
    
    // Small delay to ensure the message listener is fully set up
    const timeoutId = setTimeout(sendLoadMessage, 150);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isReady, elementTag, filePath, componentKey]);
  
  if (!componentPath) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">No component path provided</div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <iframe
        ref={iframeRef}
        src="http://localhost:8010/api/components/preview"
        className="w-full h-full border-0"
        title="Component Preview"
      />
    </div>
  );
}
