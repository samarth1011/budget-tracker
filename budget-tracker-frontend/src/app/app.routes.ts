// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { CategoriesComponent } from './categories/categories.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { BudgetComponent } from './budget/budget.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'transactions', component: TransactionDetailsComponent },
      { path: 'budget', component: BudgetComponent },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
