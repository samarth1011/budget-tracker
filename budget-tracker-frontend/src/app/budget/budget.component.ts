import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { AuthService } from '../auth.service';
import { Budget } from '../models/Budget';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {Modal} from 'bootstrap';


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  imports: [RouterModule,FormsModule, CommonModule],
  standalone: true,
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent {
  budgets: Budget[] = [];
  loading = false;
  error: string | null = null;
  message: string | null = null;
  newMonth: string = '';
  newAmount: number | null = null;

  editBudget: Budget = {
    id: 0,
    user: 0,
    month: '',
    amount: 0,
    year: 0,
    created_at: '',
    budget_remaining: 0,
    budget_spent: 0,
  };

  newBudget: Budget = {
    id: 0,
    user: 0,
    month: '',
    amount: 0,
    year: 0,
    created_at: '',
    budget_remaining: 0,
    budget_spent: 0,
  };

  months = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' },
];

years = [2024, 2025, 2026];


  constructor(private budgetService: BudgetService, private authService: AuthService) {}

  ngOnInit() {
    this.fetchBudgets();
  }

  fetchBudgets() {
    this.loading = true;
    this.budgetService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
        this.budgets.forEach(budget => {
          budget.month = this.months.find(m => m.value === Number(budget.month))?.name || '';
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load budgets.';
        this.loading = false;
      }
    });
  }

  addBudget() {
    if (!this.newBudget.month || this.newBudget.amount === null) {
      this.error = 'Month and amount are required.';
      return;
    }
    this.loading = true;
    
    this.budgetService.addBudget(this.newBudget).subscribe({
      next: (data) => {
        this.budgets.push(data);
        this.budgets.forEach(budget => {
          budget.month = this.months.find(m => m.value === Number(budget.month))?.name || '';
        });
        this.loading = false;
        this.message = 'Budget added successfully.';
        this.newMonth = '';
        this.newAmount = null;

      },
      error: (err) => {
        // Handle error message comming from api
        if (err.error || err.error.message) {
          this.error = err.message;
        } else {
          this.error = 'Failed to add budget.';
        }
        this.loading = false;
      }
    });

    
     const modalElement = document.getElementById('addBudgetModal');
      if (modalElement) {
        const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement);
        bsModal.hide();
      }
            // Fallback manual removal
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
  }

  deleteBudget(id: number | undefined) {
     if (id === undefined) {
    this.error = 'Invalid budget ID.';
    return;
  }
    this.loading = true;
    this.budgetService.deleteBudget(id).subscribe({
      next: (data) => {
        this.budgets = this.budgets.filter(budget => budget.id !== id);
        this.loading = false;
        this.message = 'Budget deleted successfully.';
      },
      error: (err) => {
        this.error = 'Failed to delete budget.' + err.message;
        this.loading = false;
      }
    });
  }

  updateBudget(budget: Budget) {
    if (!budget.month || budget.amount === null) {
      this.error = 'Month and amount are required.';
      return;
    }
    if (typeof budget.id !== 'number') {
      this.error = 'Invalid budget ID.';
      return;
    }
    this.loading = true;
    this.budgetService.updateBudget(budget.id, budget).subscribe({
      next: (updated) => {
        const index = this.budgets.findIndex(b => b.id === budget.id);
        if (index !== -1) this.budgets[index] = updated;
        this.budgets.forEach(b => {
          b.month = this.months.find(m => m.value === Number(b.month))?.name || '';
        });
        this.loading = false;
        this.message = 'Budget updated successfully.';
        this.closeModal();
      },
      error: (err) => {
        this.error = 'Failed to update budget.' + err.message;
        this.loading = false;
      }
    });

        
     const modalElement = document.getElementById('editBudgetModal');
      if (modalElement) {
        const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement);
        bsModal.hide();
      }
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
  }

  getBudgetById(id: number | undefined) {
    this.loading = true;
    if (id === undefined) {
      this.error = 'Invalid budget ID.';
      this.loading = false;
      return;
    }
    this.budgetService.getBudgetById(id).subscribe({
      next: (data) => {
        this.editBudget = data || this.editBudget;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load budget.' + err.message;
        this.loading = false;
      }
    });
  }

  closeModal() {
    const modalElement = document.getElementById('editBudgetModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      modal.hide();
    }
  }

  
}
