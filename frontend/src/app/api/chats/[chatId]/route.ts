import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL!

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: response.status }
      );
    }

    const data: any = await response.json();
    // Backend now returns grouped messages by turn. Flatten to maintain
    // backward-compatible shape for the frontend while preserving order.
    if (Array.isArray(data?.messages) && data.messages.length > 0 && data.messages[0]?.messages) {
      const flattened: any[] = [];
      for (const turn of data.messages) {
        const events = Array.isArray(turn?.messages) ? turn.messages : [];
        for (const ev of events) flattened.push(ev);
      }
      data.messages = flattened;
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete chat' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update chat' },
        { status: response.status }
      );
    }
    const chat = await response.json();
    return NextResponse.json(chat);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}