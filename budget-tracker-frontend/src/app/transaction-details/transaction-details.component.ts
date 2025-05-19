import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { DashboardService } from '../services/dashboard.service';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction';
import { Modal } from 'bootstrap';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-transaction-details',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent {
  newTransaction: Transaction = {
    id: 0,
    user: 0,
    category: 0,
    amount: 0,
    transaction_type: '',
    date: '',
    description: ''
  };

  editTransaction: Transaction = {
    id: 0,
    user: 0,
    category: 0,
    amount: 0,
    transaction_type: '',
    date: '',
    description: ''
  };

    categories: Category[] = [];
    transactions: Transaction[] = [];
  message: string | null = null;

  loading = true;
  error: string | null = null;

  filteredTransactions: any[] = [];

filter = {
  fromDate: '',
  toDate: '',
  category: null,
  minAmount: null
};
Math = Math;
// Pagination
currentPage = 1;
pageSize = 5;
  constructor(private transactionsService : TransactionService,private dashboardService: DashboardService, private categoryService: CategoriesService) {}

  ngOnInit() {
    // Initialize the transaction object or fetch it from a service
    this.loading = false;
     this.loadTransactions();
    this.loadCategories();
  }


  
get paginatedTransactions() {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredTransactions.slice(start, start + this.pageSize);
}

applyFilters() {
  this.filteredTransactions = this.transactions.filter(txn => {
    const matchDate =
      (!this.filter.fromDate || new Date(txn.date) >= new Date(this.filter.fromDate)) &&
      (!this.filter.toDate || new Date(txn.date) <= new Date(this.filter.toDate));
    
      console.log('txn.category+++', txn.category);
    const matchCategory =
      !this.filter.category || (txn.category) === this.filter.category;

    const matchAmount =
      !this.filter.minAmount || txn.amount >= this.filter.minAmount;

    return matchDate && matchCategory && matchAmount;
  });

  this.currentPage = 1; // Reset to first page on filter
}

resetFilters() {
  this.filter = {
    fromDate: '',
    toDate: '',
    category: null,
    minAmount: null
  };
  this.filteredTransactions = [...this.transactions];
  this.currentPage = 1;
}
  
  loadCategories() {
    this.dashboardService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadTransactions() {
    this.dashboardService.getTransactions().subscribe(data => {
      this.transactions = data;
       this.transactions.forEach(transaction => {
      this.getCategoryNameAndPutInTransaction(transaction);
      this.applyFilters(); 
      this.loading = false;
    });

    
    });
    
  }

  
  getCategoryNameAndPutInTransaction(transaction: Transaction) {
    this.categoryService.getCategory(transaction.category).subscribe({
      next: (data) => {
        transaction.category = data.name;
        this.loading = false;
        
      },
      error: (err) => {
        //this.error = 'Failed to load category name.';
        this.loading = false;
      }
       });
       return transaction
  }
  // make thus file as we made categories.component.ts
  // and transactions.component.ts
  // and add the necessary methods to handle transaction details
  // such as editTransaction, deleteTransaction, etc.

  //get transaction by id on edit button clciked
  getTransactionById(id: number) {
    this.loading = true;
    this.transactionsService.getTransactionById(id).subscribe({
      next: (data) => {
        this.editTransaction = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transaction details.';
        this.loading = false;
      }
    });
  }

  apiDataTransactions: Transaction[] = [];
  
   addTransaction() {
    this.loading = true;
    this.transactionsService.addTransaction(this.newTransaction).subscribe({
      next: (data) => {
        this.transactions.push(data);
         this.transactions.forEach(transaction => {
      this.getCategoryNameAndPutInTransaction(transaction);
      this.loading = false;
    });
       
      },
      error: (err) => {
        this.error = 'Failed to add transaction: ' + err.message;
        this.loading = false;
      }
    });

     this.message = 'Transaction added successfully.';
        this.loading = false;
        this.closeModal();
        this.resetForm();
  }

  deleteTransaction(id: number) {
    this.loading = true;
    this.transactionsService.deleteTransaction(id).subscribe({
      next: () => {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.loading = false;
       
        //this.resetForm();
      },
      error: (err) => {
        this.error = 'Failed to delete transaction: ' + err.message;
        this.loading = false;
      }
    });
  }

  updateTransaction(txn: any) {
    this.loading = true;
    this.transactionsService.updateTransaction(txn.id, txn).subscribe({
      next: (updated) => {
        const index = this.transactions.findIndex(t => t.id === txn.id);
        if (index !== -1) this.transactions[index] = updated;
      this.transactions.forEach(transaction => {
      this.getCategoryNameAndPutInTransaction(transaction);
      this.loading = false;
    });
        this.message = 'Transaction Updated successfully.';
        this.loading = false;
        this.closeModal();
      },
      error: (err) => {
        this.error = 'Failed to update transaction: ' + err.message;
        this.loading = false;
      }
    });
  }

  closeModal() {
    const modalElement = document.getElementById('addTransactionModal');
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement);
      bsModal.hide();
    }

    const editmodalElement = document.getElementById('editTransactionModal');
    if (editmodalElement) {
      const bsModal = Modal.getInstance(editmodalElement) || new Modal(editmodalElement);
      bsModal.hide();
    }

    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }

  resetForm() {
    this.newTransaction = {
      category: null,
      id: 0,
      amount: 0,
      user: 0,
      transaction_type: '',
      date: '',
      description: ''
    };
  }

}
