import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { APP_CONFIG } from '../../../../core/config/app-config.token';
import { AppConfig } from '../../../../core/config/app-config.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    this.loading = true;
    this.http.post<{ message: string; token: string }>(
      `${this.config.apiBaseUrl}/auth/login`,
      { username: this.username, password: this.password }
    ).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.status === 401
          ? 'Invalid username or password.'
          : 'Something went wrong. Please try again.';
      }
    });
  }
}
