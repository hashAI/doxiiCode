'use client';

import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  
  // Homepage should allow scrolling, chat pages should be fixed height
  const isHomepage = pathname === '/';
  
  if (isHomepage) {
    return (
      <main className="w-full min-h-0 flex flex-col overflow-y-auto">
        {children}
      </main>
    );
  }
  
  return (
    <main className="h-full w-full overflow-hidden min-h-0 flex flex-col">
      {children}
    </main>
  );
}