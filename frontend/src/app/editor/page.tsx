'use client';

import { EditorLayout } from '@/components/layout/editor-layout';
import React from 'react';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

export default function EditorPage() {
  // For standalone editor page, use a default chat ID
  // In actual usage, this would come from the route or context
  return <EditorLayout chatId="demo-editor" />;
}

