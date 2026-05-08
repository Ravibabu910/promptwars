'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Plane, Zap, MapPin, MessageSquare, DollarSign, Star,
  Shield, Sparkles, Globe, Users, TrendingUp, ChevronRight,
  Bot, Map, PieChart, Navigation
} from 'lucide-react';

const DESTINATIONS = ['Paris 🗼', 'Tokyo 🏯', 'Bali 🌴', 'New York 🗽', 'Santorini 🌅', 'Dubai 🌆'];

const FEATURES = [
  {
    icon: Bot,
    title: 'AI-Powered Itineraries',
    desc: 'Gemini AI crafts personalized day-by-day plans tailored to your style, budget, and interests.',
    color: 'text-neon-green',
    border: 'border-neon-green/20',
    glow: 'rgba(0,255,135,0.1)',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    desc: 'Visualize your entire trip on Google Maps with optimized routes and nearby discoveries.',
    color: 'text-neon-cyan',
    border: 'border-neon-cyan/20',
    glow: 'rgba(0,212,255,0.1)',
  },
  {
    icon: MessageSquare,
    title: 'Conversational Planning',
    desc: 'Chat naturally with TripMind to modify, optimize, and discover hidden gems in real-time.',
    color: 'text-neon-purple',
    border: 'border-neon-purple/20',
    glow: 'rgba(139,92,246,0.1)',
  },
  {
    icon: PieChart,
    title: 'Smart Budget Optimizer',
    desc: 'Track spending, get cost-saving suggestions, and visualize your travel expenses dynamically.',
    color: 'text-neon-green',
    border: 'border-neon-green/20',
    glow: 'rgba(0,255,135,0.1)',
  },
  {
    icon: Navigation,
    title: 'Real-Time Updates',
    desc: 'Live weather forecasts, traffic insights, and currency rates to keep your trip on track.',
    color: 'text-neon-cyan',
    border: 'border-neon-cyan/20',
    glow: 'rgba(0,212,255,0.1)',
  },
  {
    icon: Shield,
    title: 'Safety & Accessibility',
    desc: 'Safety tips, accessibility options, and emergency contacts for worry-free adventures.',
    color: 'text-neon-purple',
    border: 'border-neon-purple/20',
    glow: 'rgba(139,92,246,0.1)',
  },
];

const STATS = [
  { label: 'Trips Planned', value: '50K+', icon: Plane },
  { label: 'Happy Travelers', value: '30K+', icon: Users },
  { label: 'Destinations', value: '180+', icon: Globe },
  { label: 'Satisfaction', value: '98%', icon: Star },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Travel Blogger',
    avatar: 'PS',
    text: 'TripMind planned my entire 2-week Europe trip in under 3 minutes. The AI understood my budget perfectly and suggested places I would never have found myself.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Digital Nomad',
    avatar: 'MJ',
    text: 'The conversational AI is incredible. I just told it my vibe — "chill beach + local food + under $2000" — and it delivered an amazing Bali itinerary.',
    rating: 5,
  },
  {
    name: 'Yuki Tanaka',
    role: 'Family Traveler',
    avatar: 'YT',
    text: 'Planning a family trip with accessibility needs used to be stressful. TripMind handled everything including accessible routes and family-friendly restaurants.',
    rating: 5,
  },
];

export default function HomePage() {
  const [destIndex, setDestIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setInterval(() => {
      setDestIndex(i => (i + 1) % DESTINATIONS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen animated-gradient overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center">
              <Plane size={18} className="text-[#020408] rotate-45" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">TripMind AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <Link href="/planner" className="hover:text-white transition-colors">Plan Trip</Link>
            <Link href="/chat" className="hover:text-white transition-colors">AI Chat</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="hidden sm:block btn-ghost text-sm py-2 px-4">Sign In</Link>
            <Link href="/planner" className="btn-neon text-sm py-2 px-4 flex items-center gap-2">
              <Zap size={14} /><span>Get Started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff87]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d4ff]/3 rounded-full blur-3xl" />
        </div>

        <div className={`relative text-center max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge-neon mb-6">
            <div className="pulse-dot" />
            <span>Google PromptWars Challenge 2024</span>
            <Sparkles size={12} />
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-none tracking-tight">
            Your AI Travel<br />
            <span className="gradient-text">Copilot</span>
          </h1>

          {/* Animated destination */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-white/50 text-xl">Planning your trip to</span>
            <div className="glass-card px-4 py-2 border border-[#00ff87]/30 min-w-[160px] text-center">
              <span className="text-[#00ff87] font-bold text-xl">{DESTINATIONS[destIndex]}</span>
            </div>
          </div>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-balance">
            Intelligent itineraries, real-time recommendations, budget optimization — powered by Gemini AI and Google Maps. Travel smarter, not harder.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/planner"
              id="hero-start-planning"
              className="btn-neon text-base py-4 px-8 flex items-center gap-3 w-full sm:w-auto"
            >
              <Zap size={18} />
              <span>Start Planning Free</span>
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/chat"
              id="hero-try-ai-chat"
              className="btn-ghost text-base py-4 px-8 flex items-center gap-3 w-full sm:w-auto"
            >
              <MessageSquare size={18} />
              <span>Try AI Chat</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center hover-lift">
                <stat.icon size={20} className="text-[#00ff87] mx-auto mb-2" />
                <div className="font-display font-bold text-2xl gradient-text">{stat.value}</div>
                <div className="text-white/50 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4" id="features" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-neon inline-flex mb-4"><TrendingUp size={12} /><span>Powerful Features</span></div>
            <h2 id="features-heading" className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Everything you need to<br /><span className="gradient-text">travel smarter</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              From AI-powered itineraries to real-time budget tracking — TripMind is your all-in-one travel command center.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(feat => (
              <div
                key={feat.title}
                className={`glass-card-hover p-6 border ${feat.border}`}
                style={{ boxShadow: `0 4px 24px ${feat.glow}` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center mb-4 ${feat.color}`}
                  style={{ background: feat.glow }}>
                  <feat.icon size={22} className={feat.color} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feat.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4" aria-labelledby="how-it-works-heading">
        <div className="max-w-5xl mx-auto text-center">
          <h2 id="how-it-works-heading" className="font-display font-bold text-4xl sm:text-5xl mb-4">
            Plan your trip in <span className="gradient-text">3 steps</span>
          </h2>
          <p className="text-white/50 text-lg mb-16 max-w-xl mx-auto">No more hours of research. Just tell TripMind what you want.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: MapPin, title: 'Enter Preferences', desc: 'Tell us your destination, dates, budget, and travel style.' },
              { step: '02', icon: Sparkles, title: 'AI Generates Plan', desc: 'Gemini AI creates a personalized day-by-day itinerary in seconds.' },
              { step: '03', icon: Globe, title: 'Explore & Refine', desc: 'Chat with TripMind to modify and optimize your perfect trip.' },
            ].map(item => (
              <div key={item.step} className="relative glass-card p-8 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 badge-neon text-lg font-mono font-bold px-4 py-1">
                  {item.step}
                </div>
                <item.icon size={36} className="text-[#00ff87] mx-auto mt-4 mb-4" />
                <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/planner" className="btn-neon inline-flex items-center gap-2 mt-12 text-base py-4 px-8">
            <Zap size={18} /><span>Plan My Trip Now</span>
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="testimonials-heading" className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Loved by <span className="gradient-text">travelers</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glass-card-hover p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center text-dark-950 font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-white/50 text-xs">{t.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto glass-card border border-[#00ff87]/20 p-12 text-center"
          style={{ boxShadow: '0 0 60px rgba(0,255,135,0.1)' }}>
          <Plane size={48} className="text-[#00ff87] mx-auto mb-6 float-anim rotate-45" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
            Ready to explore the world<br /><span className="gradient-text">smarter?</span>
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Join thousands of travelers who plan with AI. Free forever, no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planner" id="cta-start-free" className="btn-neon text-base py-4 px-8 flex items-center justify-center gap-2">
              <Zap size={18} /><span>Start Planning Free</span>
            </Link>
            <Link href="/auth" className="btn-ghost text-base py-4 px-8">Create Account</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center">
              <Plane size={14} className="text-[#020408] rotate-45" />
            </div>
            <span className="font-display font-bold gradient-text">TripMind AI</span>
          </div>
          <p className="text-white/30 text-sm">
            Built for Google PromptWars Challenge · Powered by Gemini AI & Google Maps
          </p>
          <div className="flex gap-4 text-white/40 text-sm">
            <Link href="/auth" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/planner" className="hover:text-white transition-colors">Plan Trip</Link>
            <Link href="/chat" className="hover:text-white transition-colors">AI Chat</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
