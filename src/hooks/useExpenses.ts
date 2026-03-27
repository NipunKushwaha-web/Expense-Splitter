'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Expense, Balance } from '@/types/expense';

const EXPENSES_KEY = 'couple-expenses';

// Load expenses from localStorage
const getStoredExpenses = (): Expense[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(EXPENSES_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save expenses to localStorage
const saveExpenses = (expenses: Expense[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

// Calculate balance between two people
export const calculateBalance = (
  expenses: Expense[],
  person1Name: string,
  person2Name: string
): Balance => {
  const person1Total = expenses
    .filter((e) => e.payer === 'person1')
    .reduce((sum, e) => sum + e.amount, 0);

  const person2Total = expenses
    .filter((e) => e.payer === 'person2')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = person1Total + person2Total;
  const fairShare = totalExpenses / 2;

  const person1Owes = Math.max(0, fairShare - person1Total);
  const person2Owes = Math.max(0, fairShare - person2Total);
  const netBalance = person1Total - person2Total;

  return {
    person1Owes,
    person2Owes,
    netBalance,
    owes: netBalance > 0 ? 'person2' : netBalance < 0 ? 'person1' : null,
  };
};

export function useExpenses() {
  const queryClient = useQueryClient();

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: getStoredExpenses,
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id'>) => {
      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
      };
      const updated = [...expenses, newExpense];
      saveExpenses(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const updated = expenses.filter((e) => e.id !== id);
      saveExpenses(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      saveExpenses([]);
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  return {
    expenses,
    addExpense: addExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    clearAll: clearAllMutation.mutate,
  };
}

// GSAP animation hook
export function useBalanceAnimation(
  containerRef: React.RefObject<HTMLElement | null>,
  balance: Balance
) {
  const prevBalanceRef = useRef(balance.netBalance);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate on balance change
      if (prevBalanceRef.current !== balance.netBalance) {
        gsap.fromTo(
          '.balance-amount',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      }

      // Initial animation
      gsap.fromTo(
        '.balance-card',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }, containerRef);

    prevBalanceRef.current = balance.netBalance;

    return () => ctx.revert();
  }, [balance.netBalance, containerRef]);
}

export function useExpenseListAnimation(
  listRef: React.RefObject<HTMLElement | null>,
  expenses: Expense[]
) {
  const prevCountRef = useRef(expenses.length);

  useEffect(() => {
    if (!listRef.current) return;

    const ctx = gsap.context(() => {
      // Animate new items
      if (expenses.length > prevCountRef.current) {
        gsap.fromTo(
          '.expense-item:first-child',
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }

      // Animate on mount
      if (prevCountRef.current === 0 && expenses.length > 0) {
        gsap.fromTo(
          '.expense-item',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
        );
      }
    }, listRef);

    prevCountRef.current = expenses.length;

    return () => ctx.revert();
  }, [expenses.length, listRef]);
}
