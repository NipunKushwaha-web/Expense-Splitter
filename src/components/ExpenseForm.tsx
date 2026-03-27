'use client';

import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { PERSON_NAMES } from '@/types/expense';

interface ExpenseFormProps {
  onSubmit: (expense: {
    amount: number;
    payer: 'person1' | 'person2';
    description: string;
    date: string;
  }) => void;
}

export default function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState<'person1' | 'person2'>('person1');
  const [description, setDescription] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      // Shake animation for error
      if (formRef.current) {
        gsap.to(formRef.current, {
          keyframes: [{ x: -10 }, { x: 10 }, { x: -10 }, { x: 10 }, { x: 0 }],
          duration: 0.4,
          ease: 'power2.out',
        });
      }
      return;
    }

    onSubmit({
      amount: parseFloat(amount),
      payer,
      description: description || 'Expense',
      date: new Date().toISOString(),
    });

    // Success animation
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: 'back.out(1.7)' }
      );
    }

    // Reset form
    setAmount('');
    setDescription('');
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-xl border border-stone-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-stone-800">Add New Expense</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-stone-600 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Groceries, Dinner, Rent"
            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-black focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-stone-600 mb-2">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-semibold">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-black focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold text-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-3">Who Paid?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPayer('person1')}
              className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                payer === 'person1'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
                  {PERSON_NAMES.person1.charAt(0)}
                </span>
                {PERSON_NAMES.person1}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPayer('person2')}
              className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                payer === 'person2'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
                  {PERSON_NAMES.person2.charAt(0)}
                </span>
                {PERSON_NAMES.person2}
              </div>
            </button>
          </div>
        </div>

        <button
          ref={buttonRef}
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Expense
          </div>
        </button>
      </div>
    </form>
  );
}
