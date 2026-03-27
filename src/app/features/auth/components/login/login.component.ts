import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, LoginResponse, LoginDto } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;

  loading = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = undefined;

    const dto = this.form.value as LoginDto;
    this.auth.login(dto).subscribe({
      next: (res: LoginResponse) => {
        if (res?.token) {
          localStorage.setItem('auth_token', res.token);
        }
        this.router.navigate(['']);
      },
      error: (err: any) => {
        this.error = err?.error ?? err?.message ?? 'Login failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
