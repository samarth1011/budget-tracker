import { Component } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction';

@Component({
  selector: 'app-transactions',
  imports: [FormsModule, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
transactions: Transaction[] = [];
category: Category = {
  user: 0,
  id: 0,
  name: '',
  created_at: '',

};
  loading = true;
  error: string | null = null;

  constructor(private transactionService: TransactionService, private categoryService: CategoriesService) {}

  ngOnInit() {
    this.transactionService.getTransactions().subscribe({
  next: (data) => {
    this.transactions = data;
    this.transactions.forEach(transaction => {
      this.getCategoryNameAndPutInTransaction(transaction);
    });
    this.loading = false;
  },
  error: (err) => {
    this.error = 'Failed to load transactions.';
    this.loading = false;
  }
});
  }

  getCategoryNameAndPutInTransaction(transaction: Transaction) {
    this.categoryService.getCategory(transaction.category).subscribe({
      next: (data) => {
        transaction.category = data.name;
        this.loading = false;
        
      },
      error: (err) => {
        this.error = 'Failed to load category name.';
        this.loading = false;
      }
       });
       return transaction
  }
}
