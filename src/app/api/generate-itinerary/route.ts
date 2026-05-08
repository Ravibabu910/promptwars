import { NextRequest, NextResponse } from 'next/server';
import { generateItinerary } from '@/lib/gemini';
import { sanitizeInput } from '@/lib/utils';
import type { TripPreferences, Itinerary } from '@/types';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prefs: TripPreferences = body;

    // Validate required fields
    if (!prefs.destination || !prefs.startDate || !prefs.endDate) {
      return NextResponse.json({ error: 'Missing required fields: destination, startDate, endDate' }, { status: 400 });
    }
    if (prefs.budget <= 0) {
      return NextResponse.json({ error: 'Budget must be greater than 0' }, { status: 400 });
    }

    // Sanitize inputs
    prefs.destination = sanitizeInput(prefs.destination);

    // Generate itinerary with Gemini
    const raw = await generateItinerary(prefs);
    const parsed = JSON.parse(raw) as Partial<Itinerary>;

    const itinerary: Itinerary = {
      id: `itin_${Date.now()}`,
      userId: '',
      tripPreferences: prefs,
      days: parsed.days || [],
      totalCost: parsed.totalCost || prefs.budget,
      packingList: parsed.packingList || [],
      weatherInsights: parsed.weatherInsights || '',
      safetyTips: parsed.safetyTips || [],
      hiddenGems: parsed.hiddenGems || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Itinerary generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate itinerary';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
