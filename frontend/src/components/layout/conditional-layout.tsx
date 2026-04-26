'use client';

import { usePathname } from 'next/navigation';
import { UnifiedHeader } from '@/components/layout/unified-header';
import { AppShell } from '@/components/layout/app-shell';
import { MainContent } from '@/components/layout/main-content';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isViewRoute = pathname?.startsWith('/view');
  
  if (isViewRoute) {
    // For view routes, render children directly without any layout wrapper
    return <div className="h-screen w-full">{children}</div>;
  }
  
  return (
    <>
      <UnifiedHeader />
      <AppShell>
        <MainContent>{children}</MainContent>
      </AppShell>
    </>
  );
}


