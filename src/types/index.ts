// Application-wide TypeScript types

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelers: number;
  interests: string[];
  foodPreferences: string[];
  adventureLevel: 'relaxed' | 'moderate' | 'adventurous' | 'extreme';
  luxuryLevel: 'budget' | 'standard' | 'comfort' | 'luxury';
  accessibilityNeeds: string[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals: Meal[];
  accommodation: string;
  estimatedCost: number;
  tips: string[];
}

export interface Activity {
  id: string;
  time: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
  category: 'sightseeing' | 'adventure' | 'culture' | 'relaxation' | 'shopping' | 'transport';
  coordinates?: { lat: number; lng: number };
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant: string;
  cuisine: string;
  cost: number;
  address: string;
}

export interface Itinerary {
  id: string;
  userId: string;
  tripPreferences: TripPreferences;
  days: ItineraryDay[];
  totalCost: number;
  packingList: string[];
  weatherInsights: string;
  safetyTips: string[];
  hiddenGems: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  itineraryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  category: 'accommodation' | 'food' | 'transport' | 'activity' | 'shopping' | 'other';
  description: string;
  amount: number;
  currency: string;
  date: string;
}

export interface Recommendation {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'experience' | 'hidden_gem';
  description: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  address: string;
  coordinates: { lat: number; lng: number };
  imageUrl?: string;
  tags: string[];
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface BudgetSummary {
  total: number;
  spent: number;
  remaining: number;
  categories: Record<string, number>;
  dailyAverage: number;
  projectedTotal: number;
}
