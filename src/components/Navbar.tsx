'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Plane, Zap } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/planner', label: 'Plan Trip' },
  { href: '/chat', label: 'AI Chat' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/map', label: 'Explore Map' },
  { href: '/budget', label: 'Budget' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-card border-b border-white/5 py-3' : 'py-5 bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="TripMind AI Home">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center shadow-neon-green">
            <Plane size={18} className="text-dark-950 rotate-45" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">TripMind AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1" role="menubar">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth" className="btn-ghost text-sm py-2 px-5">Sign In</Link>
          <Link href="/planner" className="btn-neon text-sm py-2 px-5 flex items-center gap-2">
            <Zap size={14} />
            Start Planning
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden glass-card mx-4 mt-2 p-4 flex flex-col gap-2"
          role="menu"
          aria-label="Mobile navigation"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-neon-green/10 text-neon-green'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="neon-divider my-1" />
          <Link href="/auth" onClick={() => setOpen(false)} className="btn-ghost text-sm text-center py-2">
            Sign In
          </Link>
          <Link href="/planner" onClick={() => setOpen(false)} className="btn-neon text-sm text-center py-2">
            Start Planning
          </Link>
        </div>
      )}
    </nav>
  );
}
