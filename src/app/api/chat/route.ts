import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI, buildChatSystemPrompt } from '@/lib/gemini';
import { sanitizeInput } from '@/lib/utils';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages, destination, itinerary } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Sanitize last user message
    const sanitized = messages.map((m: { role: string; parts: Array<{ text: string }> }) => ({
      ...m,
      parts: m.parts.map(p => ({ text: sanitizeInput(p.text) })),
    }));

    const systemPrompt = buildChatSystemPrompt(destination, itinerary);
    const response = await chatWithAI(sanitized, systemPrompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    const message = error instanceof Error ? error.message : 'Chat failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
