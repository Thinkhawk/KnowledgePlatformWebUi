import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AppHttpError } from '../../../../core/models/app-http-error.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {

  form!: FormGroup;
  projectId!: number;
  rowVersion = '';
  concurrencyError = false;
  serverErrors: Record<string, string[]> = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: ProjectService,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(4000)]]
    });
    this.loadProject();
  }

  loadProject(): void {
    this.service.getProjectById(this.projectId).subscribe(res => {
      const project = res;
      this.rowVersion = project.rowVersion;
      this.form.patchValue({
        name: project.name,
        description: project.description
      });
    });
  }

  update(): void {
    if (this.form.invalid) return;
    this.concurrencyError = false;
    this.serverErrors = {};

    this.service.updateProject(this.projectId, {
      projectId: this.projectId,
      ...this.form.value,
      rowVersion: this.rowVersion
    }).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (user) this.sidebarService.refresh(user.userId);
        this.router.navigate(['/projects', this.projectId]);
      },
      error: (err: AppHttpError) => {
        if (err.isConcurrencyError) {
          this.concurrencyError = true;
        } else {
          this.serverErrors = err.validationErrors ?? {};
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects', this.projectId]);
  }
}
