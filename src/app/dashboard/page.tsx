'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plane, MessageSquare, DollarSign, MapPin, TrendingUp, Calendar, Zap, Clock, Star, ArrowRight, Globe } from 'lucide-react';
import { auth, getUserItineraries, logOut } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from '@/types';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const QUICK_ACTIONS = [
  { icon: Plane, label: 'Plan New Trip', href: '/planner', color: 'from-[#00ff87] to-[#00d4ff]' },
  { icon: MessageSquare, label: 'AI Chat', href: '/chat', color: 'from-[#8b5cf6] to-[#00d4ff]' },
  { icon: MapPin, label: 'Explore Map', href: '/map', color: 'from-[#00d4ff] to-[#8b5cf6]' },
  { icon: DollarSign, label: 'Budget', href: '/budget', color: 'from-[#00ff87] to-[#8b5cf6]' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { router.push('/auth'); return; }
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
      try {
        const data = await getUserItineraries(firebaseUser.uid);
        setTrips(data);
      } catch { /* no trips yet */ }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleSignOut = async () => {
    await logOut();
    toast.success('Signed out');
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen animated-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="typing-dots mb-4"><span /><span /><span /></div>
        <p className="text-white/50 text-sm">Loading your dashboard...</p>
      </div>
    </div>
  );

  const stats = [
    { label: 'Trips Planned', value: trips.length, icon: Plane, color: 'text-[#00ff87]' },
    { label: 'Destinations', value: new Set(trips.map((t: Record<string, unknown>) => (t.tripPreferences as Record<string, unknown>)?.destination)).size, icon: Globe, color: 'text-[#00d4ff]' },
    { label: 'Days Traveled', value: trips.reduce((acc: number, t: Record<string, unknown>) => acc + ((t.days as unknown[])?.length || 0), 0), icon: Calendar, color: 'text-[#8b5cf6]' },
    { label: 'AI Chats', value: 0, icon: MessageSquare, color: 'text-[#00ff87]' },
  ];

  return (
    <main className="min-h-screen animated-gradient pb-16">
      {/* Header */}
      <header className="glass-card border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center">
              <Plane size={16} className="text-[#020408] rotate-45" />
            </div>
            <span className="font-display font-bold gradient-text">TripMind AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center text-[#020408] font-bold text-sm">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{user?.displayName || 'Traveler'}</p>
                <p className="text-white/40 text-xs">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleSignOut} className="btn-ghost text-sm py-2 px-4">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-1">
            Welcome back, <span className="gradient-text">{user?.displayName?.split(' ')[0] || 'Traveler'}</span> ✈️
          </h1>
          <p className="text-white/50">Ready to plan your next adventure?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className="glass-card p-5 border border-white/8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="font-display font-bold text-3xl gradient-text">{stat.value}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.label} href={action.href}
                className="glass-card-hover p-5 border border-white/8 text-center group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <action.icon size={22} className="text-[#020408]" />
                </div>
                <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl">Recent Trips</h2>
            <Link href="/planner" className="text-[#00ff87] text-sm hover:text-white transition-colors flex items-center gap-1">
              New Trip <ArrowRight size={14} />
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="glass-card p-12 border border-white/8 text-center">
              <Globe size={48} className="text-white/20 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2 text-white/50">No trips yet</h3>
              <p className="text-white/30 text-sm mb-6">Let AI plan your first perfect trip!</p>
              <Link href="/planner" className="btn-neon inline-flex items-center gap-2 py-3 px-6">
                <Zap size={16} /> Plan Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.slice(0, 6).map((trip: Record<string, unknown>) => {
                const prefs = trip.tripPreferences as Record<string, unknown>;
                const days = trip.days as unknown[];
                return (
                  <div key={trip.id as string} className="glass-card-hover p-5 border border-white/8">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display font-bold text-lg">{prefs?.destination as string}</h3>
                        <p className="text-white/40 text-xs flex items-center gap-1 mt-1">
                          <Clock size={10} />
                          {days?.length || 0} days · {formatCurrency(prefs?.budget as number, prefs?.currency as string)}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center">
                        <Plane size={14} className="text-[#00ff87] rotate-45" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex -space-x-1">
                        {Array.from({ length: Math.min(3, prefs?.travelers as number || 1) }).map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00ff87] to-[#00d4ff] border-2 border-[#0a1628] flex items-center justify-center text-[#020408] text-xs font-bold">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={12} className="fill-yellow-400" />
                        <span className="text-xs">AI Generated</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Tip */}
        <div className="mt-8 glass-card p-6 border border-[#00ff87]/20" style={{ boxShadow: '0 0 30px rgba(0,255,135,0.08)' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-[#00ff87]" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">💡 AI Travel Tip</h3>
              <p className="text-white/60 text-sm">Book flights on Tuesdays and Wednesdays for the best prices. TripMind can help you find the optimal travel dates based on your destination and budget!</p>
              <Link href="/chat" className="text-[#00ff87] text-xs hover:text-white transition-colors mt-2 inline-flex items-center gap-1">
                Ask TripMind AI <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
