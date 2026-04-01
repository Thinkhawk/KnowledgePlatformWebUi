import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ChangePasswordModel } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  form!: FormGroup;
  loading = false;
  message?: string;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = undefined;

    const dto = this.form.value as ChangePasswordModel;
    this.auth.changePassword(dto).subscribe({
      next: res => {
        this.message = res;
        this.loading = false;
        this.auth.logout();
      },
      error: err => {
        this.error = err?.error ?? err?.message ?? 'Change password failed';
        this.loading = false;
      }
    });
  }
}
