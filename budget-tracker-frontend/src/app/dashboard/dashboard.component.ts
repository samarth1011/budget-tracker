import { Component } from '@angular/core';
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
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadTransactions();

    this.dashboardService.getDashboardData().subscribe((data) => {
    this.dashboardData = data;
  });
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
