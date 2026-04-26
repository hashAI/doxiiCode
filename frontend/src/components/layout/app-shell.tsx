'use client';

import React, { Suspense } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { ChatSidebar } from './chat-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  // Only show sidebar on chat pages, not on homepage
  const showSidebar = !isMobile && pathname.startsWith('/chat');

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      {showSidebar ? (
        <PanelGroup direction="horizontal" className="flex-1 min-h-0 h-full">
          {/* Resizable Sidebar */}
          <Panel defaultSize={30} minSize={15} maxSize={40} className="bg-white border-r">
            <Suspense fallback={<div className="h-full w-full border-r bg-white" />}> 
              <ChatSidebar />
            </Suspense>
          </Panel>
          
          {/* Resize Handle */}
          <PanelResizeHandle className="bg-gray-200 hover:bg-gray-300 cursor-col-resize" />
          
          {/* Content Panel */}
          <Panel defaultSize={70} minSize={50} maxSize={90} className="min-w-0">
            <div style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              minHeight: 0,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {children}
            </div>
          </Panel>
        </PanelGroup>
      ) : (
        // Full width layout for homepage and mobile
        <div className="flex-1 min-h-0 h-full overflow-hidden flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
}


