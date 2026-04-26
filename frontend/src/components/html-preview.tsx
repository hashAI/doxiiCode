'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HTMLPreviewProps {
  htmlContent: string;
  isVisible: boolean;
}

type ViewportSize = 'desktop' | 'mobile';

const viewportSizes = {
  desktop: { width: '100%', height: '100%', icon: Monitor },
  mobile: { width: '375px', height: '667px', icon: Smartphone },
};

export function HTMLPreview({ htmlContent, isVisible }: HTMLPreviewProps) {
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [htmlContent]);

  if (!isVisible) {
    return null;
  }

  const currentSize = viewportSizes[viewportSize];

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'flex-1'} flex flex-col border-l`}>
      {/* Preview area (toolbar removed; unified header will control) */}
      <div className="flex-1 p-4 bg-muted/20">
        <div className="h-full flex items-center justify-center">
          {htmlContent ? (
            <div
              className="bg-white border shadow-lg transition-all duration-200"
              style={{
                width: currentSize.width,
                height: currentSize.height,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="HTML Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>HTML preview will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}