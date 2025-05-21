import { Component, ViewChild } from '@angular/core';
import {  DashboardService } from '../services/dashboard.service';
import { TransactionsComponent } from '../transactions/transactions.component';
import { Category } from '../models/Category';
import { RouterModule } from '@angular/router';
import { Transaction } from '../models/Transaction';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardChartsComponent } from '../charts/dashboard-charts/dashboard-charts.component';

@Component({
  selector: 'app-dashboard',
  imports: [TransactionsComponent, DashboardChartsComponent, RouterModule,FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  categories: Category[] = [];
  transactions: Transaction[] = [];
dashboardData: any;

@ViewChild(DashboardChartsComponent)
  dashboardChartsComponent!: DashboardChartsComponent;

selectedMonth: number = new Date().getMonth() + 1; // Default current month
selectedYear: number = new Date().getFullYear();   // Default current year

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
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadTransactions();
    this.fetchDashboard();

  }


  fetchDashboard() {
  this.dashboardService.getDashboardData(this.selectedMonth, this.selectedYear).subscribe(
    (data) => {
      this.dashboardData = data;
       if (this.dashboardChartsComponent) {
        this.dashboardChartsComponent.renderCategoryWiseExpenses(data.category_expenses);
      }

    },
    (error) => {
      console.error('Error fetching dashboard data:', error);
    }
  );
}

  loadCategories() {
    this.dashboardService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadTransactions() {
    this.dashboardService.getTransactions().subscribe(data => {
      this.transactions = data;
    });
  }

  getBudgetUsedPercentage(): number {
  if (!this.dashboardData) return 0;
  const spent = parseFloat(this.dashboardData.total_expense || '0');
  const budget = parseFloat(this.dashboardData.total_budget || '1'); // Avoid divide by 0
  return budget ? Math.min(100, ((spent / budget) * 100)) : 0;
}

getExpensePercentage(): number {
  return this.getBudgetUsedPercentage();
}

}
