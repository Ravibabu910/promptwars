import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TripPreferences } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
export const geminiProModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export function buildItineraryPrompt(prefs: TripPreferences): string {
  const days = Math.ceil(
    (new Date(prefs.endDate).getTime() - new Date(prefs.startDate).getTime()) /
    (1000 * 60 * 60 * 24)
  ) + 1;

  return `You are an expert AI travel planner. Create a comprehensive, realistic travel itinerary.

TRIP DETAILS:
- Destination: ${prefs.destination}
- Dates: ${prefs.startDate} to ${prefs.endDate} (${days} days)
- Budget: ${prefs.currency} ${prefs.budget.toLocaleString()}
- Travelers: ${prefs.travelers}
- Interests: ${prefs.interests.join(', ')}
- Food Preferences: ${prefs.foodPreferences.join(', ')}
- Adventure Level: ${prefs.adventureLevel}
- Luxury Level: ${prefs.luxuryLevel}
- Accessibility Needs: ${prefs.accessibilityNeeds.join(', ') || 'None'}

Respond with a valid JSON object in EXACTLY this structure:
{
  "days": [
    {
      "day": 1,
      "date": "${prefs.startDate}",
      "theme": "Day theme/title",
      "activities": [
        {
          "id": "act_1",
          "time": "09:00",
          "name": "Activity name",
          "description": "Detailed description",
          "location": "Specific address",
          "duration": "2 hours",
          "cost": 25,
          "category": "sightseeing",
          "coordinates": {"lat": 0.0, "lng": 0.0}
        }
      ],
      "meals": [
        {
          "type": "breakfast",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "cost": 15,
          "address": "Full address"
        }
      ],
      "accommodation": "Hotel/hostel name and area",
      "estimatedCost": 200,
      "tips": ["Useful tip 1", "Useful tip 2"]
    }
  ],
  "totalCost": ${prefs.budget},
  "packingList": ["Item 1", "Item 2"],
  "weatherInsights": "Weather description and clothing advice",
  "safetyTips": ["Safety tip 1", "Safety tip 2"],
  "hiddenGems": ["Hidden gem 1 with description", "Hidden gem 2"]
}

Generate exactly ${days} days. Use real coordinates for ${prefs.destination}. Keep costs realistic for the budget of ${prefs.currency} ${prefs.budget}.`;
}

export function buildChatSystemPrompt(destination?: string, itinerary?: string): string {
  return `You are TripMind, an expert AI travel assistant for the PromptWars Travel Engine.
${destination ? `Current focus destination: ${destination}` : ''}
${itinerary ? `Current itinerary context: ${itinerary.substring(0, 1000)}` : ''}

Your capabilities:
- Modify and optimize travel itineraries
- Suggest alternative activities and restaurants
- Provide local insights and hidden gems
- Answer travel questions (visa, currency, customs, safety)
- Help with packing and preparation
- Recommend based on budget and preferences
- Convert currencies and explain costs
- Give weather-based advice

Be conversational, enthusiastic, and helpful. Use emojis appropriately. 
Format responses with markdown when useful. Keep responses concise but informative.`;
}

export async function generateItinerary(prefs: TripPreferences): Promise<string> {
  const prompt = buildItineraryPrompt(prefs);
  const result = await geminiProModel.generateContent(prompt);
  const text = result.response.text();
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse itinerary from AI response');
  return jsonMatch[0];
}

export async function chatWithAI(
  messages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  systemPrompt: string
): Promise<string> {
  const chat = geminiModel.startChat({
    history: messages.slice(0, -1),
    generationConfig: { maxOutputTokens: 1024 },
    systemInstruction: systemPrompt,
  });
  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.parts[0].text);
  return result.response.text();
}

export async function generateRecommendations(
  destination: string,
  type: string,
  budget: string
): Promise<string> {
  const prompt = `Generate 6 ${type} recommendations for ${destination} suitable for a ${budget} budget traveler.
  
  Return JSON array:
  [
    {
      "id": "rec_1",
      "name": "Name",
      "type": "${type}",
      "description": "2-3 sentence description",
      "rating": 4.5,
      "priceRange": "$$",
      "address": "Full address",
      "coordinates": {"lat": 0.0, "lng": 0.0},
      "tags": ["tag1", "tag2"]
    }
  ]`;
  
  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse recommendations');
  return jsonMatch[0];
}
