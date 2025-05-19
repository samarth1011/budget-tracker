
export interface Transaction {
  id: number;
  user: number;
  category: any;
  amount: number;
  transaction_type: string;
  date: string;
  description: string;
}
