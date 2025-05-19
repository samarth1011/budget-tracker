import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule  , CommonModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.login();
  }

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.access);
        this.router.navigate(['/dashboard']);
      },
      error: () => this.errorMessage = 'Invalid credentials'
    });
  }
}
