'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useExpenseListAnimation } from '@/hooks/useExpenses';
import { PERSON_NAMES } from '@/types/expense';
import type { Expense } from '@/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useExpenseListAnimation(listRef, expenses);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleDelete = (id: string, index: number) => {
    const element = listRef.current?.querySelector(`[data-index="${index}"]`);
    if (element) {
      gsap.to(element, {
        x: -100,
        opacity: 0,
        height: 0,
        marginBottom: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => onDelete(id),
      });
    } else {
      onDelete(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl bg-white/50 border-2 border-dashed border-stone-200 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
          <span className="text-4xl">💰</span>
        </div>
        <h3 className="text-xl font-bold text-stone-700 mb-2">No expenses yet</h3>
        <p className="text-stone-500 max-w-xs mx-auto">Add your first expense to start tracking with your partner</p>
      </div>
    );
  }

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div ref={listRef} className="space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Expenses</h3>
        <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-sm font-medium">
          {expenses.length} total
        </span>
      </div>

      <div className="space-y-3">
        {sortedExpenses.map((expense, index) => (
          <div
            key={expense.id}
            data-index={index}
            className="expense-item group flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-rose-200 transition-all duration-200"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                expense.payer === 'person1'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {PERSON_NAMES[expense.payer].charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 truncate">{expense.description}</p>
              <p className="text-sm text-stone-500">
                <span className={expense.payer === 'person1' ? 'text-rose-600' : 'text-amber-600'}>
                  {PERSON_NAMES[expense.payer]}
                </span>
                <span className="mx-1">•</span>
                {formatDate(expense.date)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-stone-800">
                {formatCurrency(expense.amount)}
              </span>
              <button
                onClick={() => handleDelete(expense.id, index)}
                className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                title="Delete expense"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
