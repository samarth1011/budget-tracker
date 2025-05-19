export interface Budget {
  id: number;
  user: number;
  month: string; 
  amount: number;
  created_at?: string;
  year: number;
  budget_remaining?: number;
  budget_spent?: number;
}