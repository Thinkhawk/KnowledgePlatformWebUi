import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarService } from '../../../core/services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectAccessReadModel } from '../../../core/models/user-access.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  projects: ProjectAccessReadModel[] = [];
  expandedProjectId: number | null = null;
  activeProjectId: number | null = null;
  activeTeamId: number | null = null;
  userName = '';
  userRole = '';
  isAdmin = false;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.username;
      this.userRole = user.role;
      this.isAdmin = this.authService.isAdmin();
      this.sidebarService.loadTree(user.userId);
    }

    this.sidebarService.projects$.subscribe(projects => {
      this.projects = projects;
    });

    // Sync expand/highlight with the current URL immediately
    this.syncRouteState(this.router.url);

    // Then keep in sync on every navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.syncRouteState(e.urlAfterRedirects));
  }

  private syncRouteState(url: string): void {
    const match = url.match(/\/projects\/(\d+)(?:\/teams\/(\d+))?/);
    if (match) {
      this.activeProjectId = Number(match[1]);
      this.activeTeamId = match[2] ? Number(match[2]) : null;
      this.expandedProjectId = this.activeProjectId;
    } else {
      this.activeProjectId = null;
      this.activeTeamId = null;
    }
  }

  toggleProject(projectId: number): void {
    this.expandedProjectId = this.expandedProjectId === projectId ? null : projectId;
  }

  isProjectExpanded(projectId: number): boolean {
    return this.expandedProjectId === projectId;
  }

  navigateToProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  navigateToTeam(projectId: number, teamId: number): void {
    this.router.navigate(['/projects', projectId, 'teams', teamId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
