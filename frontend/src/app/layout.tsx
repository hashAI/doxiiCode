import React from 'react';
import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { UIProvider } from '@/context/ui-context';
import { ConditionalLayout } from '@/components/layout/conditional-layout';

const robotoCondensed = Roboto_Condensed({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Doxii',
  description: 'AI-powered UI generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${robotoCondensed.variable} ${robotoMono.variable}`}>
      <body className="flex h-screen flex-col bg-gray-50 font-sans text-gray-900">
        <ToastProvider>
          <UIProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </UIProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
