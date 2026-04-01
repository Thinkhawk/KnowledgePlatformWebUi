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
  templateUrl: './team-edit.component.html'
})
export class TeamEditComponent implements OnInit {

  form!: FormGroup;
  projectId!: number;
  teamId!: number;
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
    this.teamId = Number(this.route.snapshot.paramMap.get('teamId'));
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
    this.loadTeam();
  }

  loadTeam(): void {
    this.service.getTeamById(this.teamId).subscribe(res => {
      const team = res;
      this.rowVersion = team.rowVersion;
      this.form.patchValue({ name: team.name });
    });
  }

  update(): void {
    if (this.form.invalid) return;
    this.concurrencyError = false;
    this.serverErrors = {};

    this.service.updateTeam(this.teamId, {
      teamId: this.teamId,
      ...this.form.value,
      rowVersion: this.rowVersion
    }).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (user) this.sidebarService.refresh(user.userId);
        this.router.navigate(['/projects', this.projectId, 'teams', this.teamId]);
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
    this.router.navigate(['/projects', this.projectId, 'teams', this.teamId]);
  }
}
