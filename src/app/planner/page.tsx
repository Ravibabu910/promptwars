'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Plane, MapPin, Calendar, Users, DollarSign, Zap, CheckCircle } from 'lucide-react';
import { INTERESTS, FOOD_PREFS, CURRENCIES, cn } from '@/lib/utils';
import type { TripPreferences, Itinerary } from '@/types';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import toast from 'react-hot-toast';

const STEPS = ['Destination', 'Dates & Budget', 'Preferences', 'Generate'];

const defaultPrefs: TripPreferences = {
  destination: '', startDate: '', endDate: '',
  budget: 2000, currency: 'USD', travelers: 2,
  interests: [], foodPreferences: [],
  adventureLevel: 'moderate', luxuryLevel: 'standard',
  accessibilityNeeds: [],
};

export default function PlannerPage() {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<TripPreferences>(defaultPrefs);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const set = (key: keyof TripPreferences, val: unknown) =>
    setPrefs(p => ({ ...p, [key]: val }));

  const toggleArr = (key: 'interests' | 'foodPreferences', val: string) => {
    const arr = prefs[key] as string[];
    set(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const canNext = () => {
    if (step === 0) return prefs.destination.trim().length > 2;
    if (step === 1) return prefs.startDate && prefs.endDate && prefs.budget > 0;
    if (step === 2) return prefs.interests.length > 0;
    return true;
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setItinerary(data);
      toast.success('Itinerary generated! 🎉');
    } catch {
      toast.error('Failed to generate itinerary. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  if (itinerary) return <ItineraryDisplay itinerary={itinerary} onBack={() => setItinerary(null)} />;

  return (
    <main className="min-h-screen animated-gradient pt-6 pb-16 px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#00ff87]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 badge-neon mb-4">
            <Plane size={12} className="rotate-45" /><span>AI Trip Planner</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl gradient-text mb-2">Plan Your Trip</h1>
          <p className="text-white/50">Answer a few questions and let Gemini AI create your perfect itinerary</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={step} aria-valuemax={3}>
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0',
                i < step ? 'bg-[#00ff87] text-[#020408]' :
                i === step ? 'bg-gradient-to-br from-[#00ff87] to-[#00d4ff] text-[#020408]' :
                'bg-white/10 text-white/40'
              )}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-white' : 'text-white/40')}>{s}</span>
              {i < STEPS.length - 1 && <div className={cn('flex-1 h-px', i < step ? 'bg-[#00ff87]/50' : 'bg-white/10')} />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 border border-white/10">

          {/* Step 0 — Destination */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Where to?</h2>
                <p className="text-white/50 text-sm">Enter your dream destination</p>
              </div>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff87]" />
                <input id="planner-destination" className="input-dark pl-12 text-lg py-4" placeholder="e.g. Tokyo, Japan"
                  value={prefs.destination} onChange={e => set('destination', e.target.value)}
                  aria-label="Destination" autoFocus />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Paris 🗼', 'Tokyo 🏯', 'Bali 🌴', 'New York 🗽', 'Dubai 🌆', 'Rome 🏛️'].map(d => (
                  <button key={d} onClick={() => set('destination', d.split(' ')[0])}
                    className={cn('py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200',
                      prefs.destination === d.split(' ')[0]
                        ? 'border-[#00ff87]/50 bg-[#00ff87]/10 text-[#00ff87]'
                        : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white')}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Dates & Budget */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">When & How Much?</h2>
                <p className="text-white/50 text-sm">Set your travel window and budget</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium" htmlFor="start-date">Start Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff87]" />
                    <input id="start-date" type="date" className="input-dark pl-11"
                      value={prefs.startDate} onChange={e => set('startDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium" htmlFor="end-date">End Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff87]" />
                    <input id="end-date" type="date" className="input-dark pl-11"
                      value={prefs.endDate} onChange={e => set('endDate', e.target.value)}
                      min={prefs.startDate || new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2 font-medium" htmlFor="travelers">Travelers</label>
                <div className="relative">
                  <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff87]" />
                  <input id="travelers" type="number" min={1} max={20} className="input-dark pl-11"
                    value={prefs.travelers} onChange={e => set('travelers', parseInt(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2 font-medium" htmlFor="budget">
                  Total Budget — <span className="text-[#00ff87] font-bold">{prefs.currency} {prefs.budget.toLocaleString()}</span>
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff87]" />
                  <input id="budget" type="number" min={100} max={1000000} step={100} className="input-dark pl-11"
                    value={prefs.budget} onChange={e => set('budget', parseInt(e.target.value))} />
                </div>
                <input type="range" min={200} max={50000} step={100} value={prefs.budget}
                  onChange={e => set('budget', parseInt(e.target.value))}
                  className="w-full mt-2 accent-[#00ff87]" aria-label="Budget slider" />
                <div className="flex justify-between text-xs text-white/30 mt-1">
                  <span>$200</span><span>$50,000</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2 font-medium">Currency</label>
                <div className="grid grid-cols-4 gap-2">
                  {CURRENCIES.slice(0, 8).map(c => (
                    <button key={c.code} onClick={() => set('currency', c.code)}
                      className={cn('py-2 px-3 rounded-lg border text-sm font-medium transition-all',
                        prefs.currency === c.code ? 'border-[#00ff87]/50 bg-[#00ff87]/10 text-[#00ff87]' : 'border-white/10 text-white/60 hover:border-white/30')}>
                      {c.symbol} {c.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Your Style</h2>
                <p className="text-white/50 text-sm">Personalize your experience</p>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-3 font-medium">Interests (pick any)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggleArr('interests', i)}
                      className={cn('py-2 px-3 rounded-lg border text-xs font-medium transition-all',
                        prefs.interests.includes(i) ? 'border-[#00ff87]/50 bg-[#00ff87]/10 text-[#00ff87]' : 'border-white/10 text-white/60 hover:border-white/30')}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-3 font-medium">Food Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {FOOD_PREFS.map(f => (
                    <button key={f} onClick={() => toggleArr('foodPreferences', f)}
                      className={cn('py-2 px-3 rounded-lg border text-xs font-medium transition-all',
                        prefs.foodPreferences.includes(f) ? 'border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff]' : 'border-white/10 text-white/60 hover:border-white/30')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium" htmlFor="adventure-level">Adventure Level</label>
                  <select id="adventure-level" className="input-dark" value={prefs.adventureLevel}
                    onChange={e => set('adventureLevel', e.target.value)}>
                    <option value="relaxed">🌿 Relaxed</option>
                    <option value="moderate">⚡ Moderate</option>
                    <option value="adventurous">🏔️ Adventurous</option>
                    <option value="extreme">🔥 Extreme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium" htmlFor="luxury-level">Luxury Level</label>
                  <select id="luxury-level" className="input-dark" value={prefs.luxuryLevel}
                    onChange={e => set('luxuryLevel', e.target.value)}>
                    <option value="budget">💰 Budget</option>
                    <option value="standard">🏨 Standard</option>
                    <option value="comfort">✨ Comfort</option>
                    <option value="luxury">👑 Luxury</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Review & Generate */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Ready to Generate!</h2>
                <p className="text-white/50 text-sm">Review your trip details</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Destination', val: prefs.destination },
                  { label: 'Dates', val: `${prefs.startDate} → ${prefs.endDate}` },
                  { label: 'Travelers', val: prefs.travelers },
                  { label: 'Budget', val: `${prefs.currency} ${prefs.budget.toLocaleString()}` },
                  { label: 'Interests', val: prefs.interests.join(', ') || 'None selected' },
                  { label: 'Adventure', val: prefs.adventureLevel },
                  { label: 'Luxury', val: prefs.luxuryLevel },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-white/50 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium text-right max-w-[60%] truncate">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="glass-card p-4 border border-[#00ff87]/20" style={{ boxShadow: '0 0 20px rgba(0,255,135,0.1)' }}>
                <p className="text-white/70 text-sm text-center">
                  🤖 Gemini AI will generate a personalized {prefs.destination} itinerary with day-by-day activities, restaurants, costs, and hidden gems.
                </p>
              </div>
              <button id="generate-itinerary-btn" onClick={generate} disabled={loading}
                className="btn-neon w-full flex items-center justify-center gap-3 py-4 text-base disabled:opacity-50">
                {loading ? (
                  <><span className="typing-dots"><span /><span /><span /></span><span className="ml-2">Generating with Gemini AI...</span></>
                ) : (
                  <><Zap size={20} /><span>Generate My Itinerary</span></>
                )}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="btn-ghost flex items-center gap-2 py-2 px-6 disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft size={16} /> Back
            </button>
            {step < 3 && (
              <button id="planner-next-btn" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="btn-neon flex items-center gap-2 py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
