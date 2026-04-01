import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { Project } from '../../models/project.model';
import { Team } from '../../models/team.model';
import { AppHttpError } from '../../../../core/models/app-http-error.model';

@Component({
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent, IconComponent],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  project!: Project;
  teams: Team[] = [];
  canEditProject = false;
  canDeleteProject = false;
  isLead = false;
  projectId!: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private service: ProjectService,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.canEditProject = this.authService.isAdmin();
    this.canDeleteProject = this.authService.isAdmin();
    this.isLead = this.authService.isLead();

    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
      this.loadProject();
      this.loadTeams();
    });
  }

  loadProject(): void {
    this.service.getProjectById(this.projectId).subscribe(res => {
      this.project = res;
    });
  }

  loadTeams(): void {
    this.service.getTeamsByProject(this.projectId).subscribe(res => {
      if (this.authService.isAdmin() || this.authService.isLead()) {
        this.teams = res;
      } else {
        // TeamMember: only show teams they are assigned to (from sidebar access data)
        const accessProject = this.sidebarService.getProjects()
          .find(p => p.projectId === this.projectId);
        const assignedTeamIds = new Set((accessProject?.teams ?? []).map(t => t.teamId));
        this.teams = res.filter(t => assignedTeamIds.has(t.teamId));
      }
    });
  }

  editProject(): void {
    this.router.navigate(['/projects', this.projectId, 'edit']);
  }

  confirmDelete(): void {
    this.deleteModal.open();
  }

  onDeleteConfirmed(): void {
    this.service.deleteProject(this.projectId, { projectId: this.projectId, rowVersion: this.project.rowVersion }).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (user) this.sidebarService.refresh(user.userId);
        this.router.navigate(['/projects']);
      },
      error: (err: AppHttpError) => {
        if (err.isConcurrencyError) {
          alert('This record was updated by someone else. Please refresh and try again.');
        }
      }
    });
  }

  createTeam(): void {
    this.router.navigate(['/projects', this.projectId, 'teams', 'create']);
  }

  openTeam(team: Team): void {
    this.router.navigate(['/projects', this.projectId, 'teams', team.teamId]);
  }
}
