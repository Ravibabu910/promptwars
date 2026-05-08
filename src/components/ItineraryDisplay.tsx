'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, MapPin, Clock, Utensils, Lightbulb, Package, Cloud, Shield, Gem, ChevronDown, ChevronUp, Download, MessageSquare, Map } from 'lucide-react';
import type { Itinerary, ItineraryDay } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface Props { itinerary: Itinerary; onBack: () => void; }

const CAT_COLORS: Record<string, string> = {
  sightseeing: '#00ff87', adventure: '#ff006e', culture: '#8b5cf6',
  relaxation: '#00d4ff', shopping: '#f59e0b', transport: '#6b7280',
};

function DayCard({ day }: { day: ItineraryDay }) {
  const [open, setOpen] = useState(day.day === 1);
  return (
    <div className="glass-card border border-white/8 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors" aria-expanded={open}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center text-[#020408] font-display font-bold text-lg flex-shrink-0">
            {day.day}
          </div>
          <div className="text-left">
            <p className="font-display font-bold text-lg">{day.theme}</p>
            <p className="text-white/40 text-sm flex items-center gap-1.5">
              <Calendar size={12} /> {formatDate(day.date)}
              <span className="mx-1">·</span>
              <DollarSign size={12} /> Est. {formatCurrency(day.estimatedCost)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-neon text-xs hidden sm:flex">{day.activities.length} activities</span>
          {open ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/5 p-5 space-y-6">
          {/* Activities Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={14} /> Schedule
            </h3>
            <div className="space-y-3">
              {day.activities.map((act, i) => (
                <div key={act.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: CAT_COLORS[act.category] || '#00ff87' }} />
                    {i < day.activities.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono text-white/40">{act.time}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${CAT_COLORS[act.category]}20`, color: CAT_COLORS[act.category] }}>{act.category}</span>
                        </div>
                        <p className="font-semibold text-sm">{act.name}</p>
                        <p className="text-white/50 text-xs mt-0.5">{act.description}</p>
                        <p className="text-white/30 text-xs flex items-center gap-1 mt-1"><MapPin size={10} />{act.location} · {act.duration}</p>
                      </div>
                      <span className="text-[#00ff87] font-bold text-sm flex-shrink-0">{formatCurrency(act.cost)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meals */}
          {day.meals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Utensils size={14} /> Meals
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {day.meals.map((meal, i) => (
                  <div key={i} className="glass-card p-3 border border-white/5">
                    <span className="text-xs text-[#00d4ff] font-semibold capitalize">{meal.type}</span>
                    <p className="font-medium text-sm mt-1">{meal.restaurant}</p>
                    <p className="text-white/40 text-xs">{meal.cuisine}</p>
                    <p className="text-[#00ff87] text-xs font-bold mt-1">{formatCurrency(meal.cost)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {day.tips.length > 0 && (
            <div className="glass-card p-4 border border-[#f59e0b]/20" style={{ background: 'rgba(245,158,11,0.05)' }}>
              <h3 className="text-sm font-semibold text-[#f59e0b] mb-2 flex items-center gap-2">
                <Lightbulb size={14} /> Pro Tips
              </h3>
              <ul className="space-y-1">
                {day.tips.map((tip, i) => <li key={i} className="text-white/60 text-xs flex items-start gap-2"><span className="text-[#f59e0b] mt-0.5">•</span>{tip}</li>)}
              </ul>
            </div>
          )}

          {/* Accommodation */}
          {day.accommodation && (
            <p className="text-white/40 text-xs flex items-center gap-2">
              <span className="text-[#8b5cf6]">🏨 Accommodation:</span> {day.accommodation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItineraryDisplay({ itinerary, onBack }: Props) {
  const tabs = ['Itinerary', 'Essentials', 'Tips'] as const;
  const [tab, setTab] = useState<typeof tabs[number]>('Itinerary');

  return (
    <main className="min-h-screen animated-gradient pb-16">
      {/* Header */}
      <div className="glass-card border-b border-white/5 px-4 py-4 mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Edit Preferences
          </button>
          <div className="flex gap-3">
            <Link href="/chat" className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <MessageSquare size={14} /> AI Chat
            </Link>
            <Link href="/map" className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <Map size={14} /> View Map
            </Link>
            <button id="download-pdf-btn" className="btn-neon py-2 px-4 text-sm flex items-center gap-2"
              onClick={() => window.print()}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Summary */}
        <div className="glass-card p-6 border border-[#00ff87]/20 mb-6" style={{ boxShadow: '0 0 40px rgba(0,255,135,0.08)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="badge-neon inline-flex mb-3">✨ AI-Generated Itinerary</div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-1">
                {itinerary.tripPreferences.destination}
              </h1>
              <p className="text-white/50 text-sm">
                {itinerary.days.length} days · {itinerary.tripPreferences.travelers} travelers · {itinerary.tripPreferences.adventureLevel} adventure
              </p>
            </div>
            <div className="glass-card p-4 border border-white/10 text-center">
              <p className="text-white/40 text-xs mb-1">Estimated Total</p>
              <p className="font-display font-bold text-3xl gradient-text">{formatCurrency(itinerary.totalCost, itinerary.tripPreferences.currency)}</p>
              <p className="text-white/30 text-xs mt-1">of {formatCurrency(itinerary.tripPreferences.budget, itinerary.tripPreferences.currency)} budget</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-5 py-2.5 rounded-xl text-sm font-semibold transition-all', t === tab ? 'bg-gradient-to-r from-[#00ff87] to-[#00d4ff] text-[#020408]' : 'glass-card border border-white/10 text-white/60 hover:text-white')}>
              {t}
            </button>
          ))}
        </div>

        {/* Itinerary Days */}
        {tab === 'Itinerary' && (
          <div className="space-y-4">
            {itinerary.days.map(day => <DayCard key={day.day} day={day} />)}
          </div>
        )}

        {/* Essentials */}
        {tab === 'Essentials' && (
          <div className="space-y-4">
            {/* Packing List */}
            <div className="glass-card p-6 border border-white/8">
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><Package size={20} className="text-[#00ff87]" /> Packing List</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {itinerary.packingList.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ff87]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Weather */}
            {itinerary.weatherInsights && (
              <div className="glass-card p-6 border border-[#00d4ff]/20">
                <h2 className="font-display font-bold text-xl mb-3 flex items-center gap-2"><Cloud size={20} className="text-[#00d4ff]" /> Weather Insights</h2>
                <p className="text-white/70 text-sm">{itinerary.weatherInsights}</p>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {tab === 'Tips' && (
          <div className="space-y-4">
            <div className="glass-card p-6 border border-[#ff006e]/20">
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><Shield size={20} className="text-[#ff006e]" /> Safety Tips</h2>
              <ul className="space-y-2">
                {itinerary.safetyTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70"><span className="text-[#ff006e] mt-0.5">•</span>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-6 border border-[#8b5cf6]/20">
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><Gem size={20} className="text-[#8b5cf6]" /> Hidden Gems</h2>
              <ul className="space-y-2">
                {itinerary.hiddenGems.map((gem, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70"><span className="text-[#8b5cf6] mt-0.5">💎</span>{gem}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
