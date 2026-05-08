import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/gemini';
import { sanitizeInput } from '@/lib/utils';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { destination, type = 'attraction', budget = 'moderate' } = await req.json();

    if (!destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
    }

    const cleanDest = sanitizeInput(destination);
    const raw = await generateRecommendations(cleanDest, type, budget);
    const recommendations = JSON.parse(raw);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
