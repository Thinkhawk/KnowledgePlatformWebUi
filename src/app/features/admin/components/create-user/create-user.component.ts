import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent {

  form: FormGroup;
  successMessage = '';
  errorMessage = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['TeamMember', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.adminService.createUser(this.form.value).subscribe({
      next: () => {
        this.successMessage = `User "${this.form.value.fullName}" created successfully.`;
        this.form.reset({ role: 'TeamMember' });
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = err?.detail ?? 'Failed to create user. Please try again.';
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
