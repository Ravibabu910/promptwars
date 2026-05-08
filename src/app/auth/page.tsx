'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Plane, Mail, Lock, Chrome, Zap, ArrowLeft } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, registerWithEmail, createUserProfile } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const googleAuth = async () => {
    setLoading(true);
    try {
      const r = await signInWithGoogle();
      await createUserProfile(r.user);
      toast.success(`Welcome, ${r.user.displayName}! 🌍`);
      router.push('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally { setLoading(false); }
  };

  const emailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be ≥ 6 chars'); return; }
    setLoading(true);
    try {
      if (mode === 'register') {
        const r = await registerWithEmail(form.email, form.password);
        await createUserProfile(r.user);
        toast.success('Account created! 🚀');
      } else {
        await signInWithEmail(form.email, form.password);
        toast.success('Welcome back! ✈️');
      }
      router.push('/dashboard');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Auth failed';
      toast.error(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff87]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="glass-card p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center">
              <Plane size={20} className="text-[#020408] rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text">TripMind AI</h1>
              <p className="text-white/40 text-xs">Your AI Travel Copilot</p>
            </div>
          </div>
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button key={m} id={`tab-${m}`} onClick={() => setMode(m)}
                className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${mode === m ? 'bg-gradient-to-r from-[#00ff87] to-[#00d4ff] text-[#020408]' : 'text-white/50 hover:text-white'}`}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
          <h2 className="font-display font-bold text-2xl mb-1">{mode === 'login' ? 'Welcome back' : 'Join TripMind'}</h2>
          <p className="text-white/50 text-sm mb-6">{mode === 'login' ? 'Sign in to access your trips' : 'Start planning smarter trips for free'}</p>
          <button id="google-signin" onClick={googleAuth} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all mb-4 disabled:opacity-50">
            <Chrome size={18} className="text-[#00ff87]" /> Continue with Google
          </button>
          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 neon-divider" />
            <span className="text-white/30 text-xs">or with email</span>
            <div className="flex-1 neon-divider" />
          </div>
          <form onSubmit={emailAuth} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input id="auth-email" name="email" type="email" placeholder="Email address"
                value={form.email} onChange={change} required className="input-dark pl-11"
                aria-label="Email address" autoComplete="email" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input id="auth-password" name="password" type={showPass ? 'text' : 'password'}
                placeholder="Password (min 6 chars)" value={form.password} onChange={change}
                required className="input-dark pl-11 pr-11" aria-label="Password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button id="auth-submit" type="submit" disabled={loading}
              className="btn-neon w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
              {loading ? <span className="typing-dots"><span /><span /><span /></span> : <><Zap size={16} />{mode === 'login' ? 'Sign In' : 'Create Account'}</>}
            </button>
          </form>
          <p className="text-white/40 text-xs text-center mt-6">By continuing, you agree to our Terms of Service.</p>
        </div>
      </div>
    </main>
  );
}
