import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'https://budget-tracker-rsz8.vercel.app/api'; // your backend URL here

  constructor(private http: HttpClient) {}

  getDashboardData() {
    return this.http.get<any>(`${this.baseUrl}/dashboard/`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/`);
  }

  addCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories/`, category);
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions/`, transaction);
  }

  // Add methods for budgets similarly...
}
