export async function fetchChats() {
  const response = await fetch('/api/chats');
  if (!response.ok) throw new Error('Failed to fetch chats');
  return response.json();
}

export async function createChat(title: string) {
  const response = await fetch('/api/chats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create chat');
  return response.json();
}

export async function fetchChat(chatId: string) {
  const response = await fetch(`/api/chats/${chatId}`);
  if (!response.ok) throw new Error('Failed to fetch chat');
  return response.json();
}

export async function deleteChat(chatId: string) {
  const response = await fetch(`/api/chats/${chatId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete chat');
  return response.json();
}

export async function renameChat(chatId: string, title: string) {
  const response = await fetch(`/api/chats/${chatId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to rename chat');
  return response.json();
}

export async function addMessage(chatId: string, content: string, role: 'user' | 'assistant' = 'user') {
  const response = await fetch(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, role }),
  });
  if (!response.ok) throw new Error('Failed to add message');
  return response.json();
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function fetchChatFiles(chatId: string) {
  const response = await fetch(`${API_BASE_URL}/files/chats/${chatId}`);
  if (!response.ok) throw new Error('Failed to fetch files');
  return response.json();
}

export async function fetchFile(fileId: string) {
  const response = await fetch(`${API_BASE_URL}/files/${fileId}`);
  if (!response.ok) throw new Error('Failed to fetch file');
  return response.json();
}

export async function updateFile(fileId: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Failed to update file');
  return response.json();
}

export async function fetchChatFileContentByPath(chatId: string, path: string, maxBytes: number = 500000) {
  const url = `${API_BASE_URL}/files/chats/${chatId}/content?path=${encodeURIComponent(path)}&max_bytes=${maxBytes}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch file content');
  return response.json() as Promise<{ path: string; content: string; truncated: boolean }>
}

export async function listChatWorkspaceFiles(chatId: string) {
  const url = `${API_BASE_URL}/files/chats/${chatId}/list`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to list files');
  return response.json() as Promise<{ files: string[]; truncated: boolean }>;
}