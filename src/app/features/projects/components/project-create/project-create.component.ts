import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { AppHttpError } from '../../../../core/models/app-http-error.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-create.component.html'
})
export class ProjectCreateComponent implements OnInit {

  form!: FormGroup;
  serverErrors: Record<string, string[]> = {};

  constructor(
    private fb: FormBuilder,
    private service: ProjectService,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(4000)]]
    });
  }

  create(): void {
    if (this.form.invalid) return;

    const user = this.authService.getCurrentUser();
    const payload = {
      ...this.form.value,
      creatorId: user?.userId
    };

    this.service.createProject(payload).subscribe({
      next: () => {
        this.sidebarService.refresh(user!.userId);
        this.router.navigate(['/projects']);
      },
      error: (err: AppHttpError) => {
        this.serverErrors = err.validationErrors ?? {};
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}
