import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { CreateUserModel } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  form!: FormGroup;
  loading = false;
  message?: string;
  error?: string;
  roles = ['ProjectAdmin', 'ProjectLead', 'TeamMember'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = undefined;

    const dto = this.form.value as CreateUserModel;
    this.auth['createUser'] ? this.auth['createUser'](dto).subscribe({
      next: res => {
        this.message = res;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error ?? err?.message ?? 'Create user failed';
        this.loading = false;
      }
    }) : Promise.reject('createUser not available on AuthService');
  }
}
