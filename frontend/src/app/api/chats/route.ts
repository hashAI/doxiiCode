import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL!

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/chats/`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch chats' },
        { status: response.status }
      );
    }

    const chats = await response.json();
    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/chats/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create chat' },
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