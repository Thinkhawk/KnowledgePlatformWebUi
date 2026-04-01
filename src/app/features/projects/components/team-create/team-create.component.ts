import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { AppHttpError } from '../../../../core/models/app-http-error.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team-create.component.html'
})
export class TeamCreateComponent implements OnInit {

  form!: FormGroup;
  projectId!: number;
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
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  create(): void {
    if (this.form.invalid) return;

    const user = this.authService.getCurrentUser();
    const payload = {
      ...this.form.value,
      projectId: this.projectId,
      creatorId: user?.userId
    };

    this.service.createTeam(payload).subscribe({
      next: () => {
        if (user) this.sidebarService.refresh(user.userId);
        this.router.navigate(['/projects', this.projectId]);
      },
      error: (err: AppHttpError) => {
        this.serverErrors = err.validationErrors ?? {};
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects', this.projectId]);
  }
}
