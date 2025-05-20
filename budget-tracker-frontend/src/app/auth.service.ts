// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://13.60.37.79/api/token/';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post(this.API_URL, { username, password }, { withCredentials: true });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
  return !!localStorage.getItem('access_token');
}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token!);
  }

 getUserId(): number | undefined {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user ? user.id : undefined;
}

  private jwtHelper = new JwtHelperService();
}
