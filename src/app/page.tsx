'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import BalanceDisplay from '@/components/BalanceDisplay';
import { useExpenses } from '@/hooks/useExpenses';

export default function Home() {
  const { expenses, addExpense, deleteExpense, clearAll } = useExpenses();
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (mainRef.current) {
      tl.fromTo(
        mainRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div ref={headerRef} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 to-orange-400 shadow-xl mb-6">
            <span className="text-4xl">💕</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent mb-4">
            Couples Expense Splitter
          </h1>
          <p className="text-lg text-stone-600 max-w-md mx-auto">
            Track and split expenses fairly with your partner
          </p>
        </div>

        <div ref={mainRef} className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BalanceDisplay expenses={expenses} />
            <ExpenseForm onSubmit={addExpense} />

            {expenses.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all expenses?')) {
                    clearAll();
                  }
                }}
                className="w-full py-3 px-4 text-rose-600 font-medium rounded-2xl border-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all duration-200"
              >
                Clear All Expenses
              </button>
            )}
          </div>

          <div className="lg:col-span-3">
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
        </div>
      </div>

      <footer className="mt-auto text-center text-sm text-stone-500 py-8">
        <a
          href="https://instagram.com/thakurxnipun"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 text-rose-600 hover:text-rose-700 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.073-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Build by @thakurxnipun
        </a>
      </footer>
    </div>
  );
}
