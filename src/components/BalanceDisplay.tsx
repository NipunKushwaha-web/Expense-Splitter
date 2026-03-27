'use client';

import { useRef } from 'react';
import { useBalanceAnimation, calculateBalance } from '@/hooks/useExpenses';
import { PERSON_NAMES } from '@/types/expense';
import type { Expense } from '@/types/expense';

interface BalanceDisplayProps {
  expenses: Expense[];
}

export default function BalanceDisplay({ expenses }: BalanceDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const balance = calculateBalance(expenses, PERSON_NAMES.person1, PERSON_NAMES.person2);

  useBalanceAnimation(containerRef, balance);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const person1Total = expenses
    .filter((e) => e.payer === 'person1')
    .reduce((sum, e) => sum + e.amount, 0);

  const person2Total = expenses
    .filter((e) => e.payer === 'person2')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="balance-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-1 shadow-xl">
        <div className="relative rounded-[22px] bg-white/10 backdrop-blur-sm p-6 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[22px]" />

          <div className="relative">
            <p className="text-sm font-medium text-white/80 uppercase tracking-wider mb-2">Current Balance</p>

            <div className="balance-amount">
              {balance.owes === null ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-2xl font-bold">All Settled Up!</p>
                  <p className="text-white/70 text-sm mt-1">No one owes anything</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-5xl font-bold mb-2 drop-shadow-lg">
                    {formatCurrency(Math.abs(balance.netBalance / 2))}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="font-medium">
                      {balance.owes === 'person1' ? PERSON_NAMES.person1 : PERSON_NAMES.person2}
                    </span>
                    <span className="text-white/70">owes</span>
                    <span className="font-medium">
                      {balance.owes === 'person1' ? PERSON_NAMES.person2 : PERSON_NAMES.person1}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="balance-card group rounded-2xl bg-white p-5 shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              {PERSON_NAMES.person1.charAt(0)}
            </div>
            <p className="text-sm text-stone-500 font-medium">{PERSON_NAMES.person1}</p>
          </div>
          <p className="text-2xl font-bold text-stone-800 group-hover:text-rose-600 transition-colors">
            {formatCurrency(person1Total)}
          </p>
          <p className="text-xs text-stone-400 mt-1">total paid</p>
        </div>

        <div className="balance-card group rounded-2xl bg-white p-5 shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              {PERSON_NAMES.person2.charAt(0)}
            </div>
            <p className="text-sm text-stone-500 font-medium">{PERSON_NAMES.person2}</p>
          </div>
          <p className="text-2xl font-bold text-stone-800 group-hover:text-amber-600 transition-colors">
            {formatCurrency(person2Total)}
          </p>
          <p className="text-xs text-stone-400 mt-1">total paid</p>
        </div>
      </div>

      <div className="balance-card rounded-2xl bg-stone-800 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-400 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-700 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
