'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, DollarSign, TrendingDown, PieChart, Plane, ShoppingBag, Utensils, Car, Activity, MoreHorizontal } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency, generateId } from '@/lib/utils';
import type { Expense } from '@/types';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { key: 'accommodation', label: 'Accommodation', icon: Plane, color: '#00ff87' },
  { key: 'food', label: 'Food & Dining', icon: Utensils, color: '#00d4ff' },
  { key: 'transport', label: 'Transport', icon: Car, color: '#8b5cf6' },
  { key: 'activity', label: 'Activities', icon: Activity, color: '#ff006e' },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#f59e0b' },
  { key: 'other', label: 'Other', icon: MoreHorizontal, color: '#6b7280' },
] as const;

const SAMPLE: Expense[] = [
  { id: '1', tripId: 'demo', category: 'accommodation', description: 'Hotel night 1', amount: 120, currency: 'USD', date: '2024-06-01' },
  { id: '2', tripId: 'demo', category: 'food', description: 'Dinner at local restaurant', amount: 45, currency: 'USD', date: '2024-06-01' },
  { id: '3', tripId: 'demo', category: 'transport', description: 'Airport taxi', amount: 35, currency: 'USD', date: '2024-06-01' },
  { id: '4', tripId: 'demo', category: 'activity', description: 'Museum tickets', amount: 28, currency: 'USD', date: '2024-06-02' },
  { id: '5', tripId: 'demo', category: 'food', description: 'Breakfast café', amount: 18, currency: 'USD', date: '2024-06-02' },
  { id: '6', tripId: 'demo', category: 'shopping', description: 'Souvenirs', amount: 65, currency: 'USD', date: '2024-06-02' },
];

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE);
  const [totalBudget, setTotalBudget] = useState(1500);
  const [form, setForm] = useState({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0] });

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const pct = Math.min((totalSpent / totalBudget) * 100, 100);

  const catData = CATEGORIES.map(c => ({
    name: c.label,
    value: expenses.filter(e => e.category === c.key).reduce((s, e) => s + e.amount, 0),
    color: c.color,
  })).filter(d => d.value > 0);

  const addExpense = () => {
    if (!form.description || !form.amount) { toast.error('Fill all fields'); return; }
    const expense: Expense = {
      id: generateId(), tripId: 'demo',
      category: form.category as Expense['category'],
      description: form.description, amount: parseFloat(form.amount),
      currency: 'USD', date: form.date,
    };
    setExpenses(prev => [expense, ...prev]);
    setForm(p => ({ ...p, description: '', amount: '' }));
    toast.success('Expense added!');
  };

  const del = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <main className="min-h-screen animated-gradient pb-16">
      <header className="glass-card border-b border-white/5 px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="font-display font-bold text-xl gradient-text">Budget Optimizer</h1>
            <p className="text-white/40 text-xs">Track & optimize your travel spending</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        {/* Budget Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6 border border-[#00ff87]/20">
            <p className="text-white/50 text-sm mb-1">Total Budget</p>
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-[#00ff87]" />
              <input type="number" value={totalBudget} onChange={e => setTotalBudget(parseInt(e.target.value))}
                className="bg-transparent text-3xl font-display font-bold gradient-text w-32 outline-none"
                aria-label="Total budget" />
            </div>
            <p className="text-white/30 text-xs mt-2">Click to edit</p>
          </div>
          <div className="glass-card p-6 border border-[#ff006e]/20">
            <p className="text-white/50 text-sm mb-1">Total Spent</p>
            <div className="text-3xl font-display font-bold text-[#ff006e]">{formatCurrency(totalSpent)}</div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>Progress</span><span>{pct.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: pct > 90 ? '#ff006e' : pct > 70 ? '#f59e0b' : '#00ff87' }} />
              </div>
            </div>
          </div>
          <div className={`glass-card p-6 border ${remaining >= 0 ? 'border-[#00ff87]/20' : 'border-[#ff006e]/20'}`}>
            <p className="text-white/50 text-sm mb-1">Remaining</p>
            <div className={`text-3xl font-display font-bold ${remaining >= 0 ? 'text-[#00ff87]' : 'text-[#ff006e]'}`}>
              {formatCurrency(Math.abs(remaining))}
              {remaining < 0 && <span className="text-sm ml-2">over!</span>}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown size={14} className="text-white/30" />
              <span className="text-white/30 text-xs">Daily avg: {formatCurrency(totalSpent / 7)}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="glass-card p-6 border border-white/8">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <PieChart size={18} className="text-[#00ff87]" /> Spending by Category
            </h2>
            {catData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2">
                  {catData.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs text-white/60">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      {d.name}: {formatCurrency(d.value)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/30 text-sm">No expenses yet</div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="glass-card p-6 border border-white/8">
            <h2 className="font-display font-bold text-lg mb-4">Daily Spending</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[
                { day: 'Day 1', amount: expenses.filter(e => e.date === '2024-06-01').reduce((s, e) => s + e.amount, 0) },
                { day: 'Day 2', amount: expenses.filter(e => e.date === '2024-06-02').reduce((s, e) => s + e.amount, 0) },
                { day: 'Day 3', amount: 0 }, { day: 'Day 4', amount: 0 },
              ]} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} />
                <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="amount" fill="#00ff87" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Expense */}
        <div className="glass-card p-6 border border-white/8 mb-6">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#00ff87]" /> Add Expense
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            <input id="expense-desc" placeholder="Description" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-dark sm:col-span-1" aria-label="Expense description" />
            <input id="expense-amount" type="number" placeholder="Amount (USD)" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              className="input-dark" aria-label="Expense amount" />
            <select id="expense-category" value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="input-dark" aria-label="Expense category">
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <button id="add-expense-btn" onClick={addExpense} className="btn-neon flex items-center justify-center gap-2">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Expense List */}
        <div className="glass-card p-6 border border-white/8">
          <h2 className="font-display font-bold text-lg mb-4">Expense Log</h2>
          <div className="space-y-3">
            {expenses.map(exp => {
              const cat = CATEGORIES.find(c => c.key === exp.category);
              return (
                <div key={exp.id} className="flex items-center gap-4 py-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cat?.color}20`, border: `1px solid ${cat?.color}40` }}>
                    {cat && <cat.icon size={16} style={{ color: cat.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{exp.description}</p>
                    <p className="text-white/40 text-xs">{cat?.label} · {exp.date}</p>
                  </div>
                  <span className="font-bold text-sm" style={{ color: cat?.color }}>{formatCurrency(exp.amount)}</span>
                  <button onClick={() => del(exp.id)} className="text-white/20 hover:text-[#ff006e] transition-colors p-1.5 rounded-lg hover:bg-[#ff006e]/10" aria-label="Delete expense">
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
