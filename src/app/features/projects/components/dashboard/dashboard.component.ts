import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { ProjectAccessReadModel } from '../../../../core/models/user-access.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userName = '';
  canCreateProject = false;
  projects: ProjectAccessReadModel[] = [];
  projectCount = 0;
  teamCount = 0;

  constructor(
    public router: Router,
    public authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.username;
    }
    this.canCreateProject = this.authService.isAdmin();

    this.sidebarService.projects$.subscribe(projects => {
      this.projects = projects;
      this.projectCount = projects.length;
      this.teamCount = projects.reduce((sum, p) => sum + p.teams.length, 0);
    });
  }

  openProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }
}
