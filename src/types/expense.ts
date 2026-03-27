export interface Expense {
  id: string;
  amount: number;
  payer: 'person1' | 'person2';
  description: string;
  date: string;
}

export interface Balance {
  person1Owes: number;
  person2Owes: number;
  netBalance: number;
  owes: 'person1' | 'person2' | null;
}

export const PERSON_NAMES = {
  person1: 'Partner 1',
  person2: 'Partner 2',
} as const;
