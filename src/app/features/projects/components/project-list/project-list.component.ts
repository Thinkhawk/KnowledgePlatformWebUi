import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { ProjectAccessReadModel } from '../../../../core/models/user-access.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: ProjectAccessReadModel[] = [];
  canCreateProject = false;

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.canCreateProject = this.authService.isAdmin();
    this.sidebarService.projects$.subscribe(res => {
      this.projects = res;
    });
  }

  openProject(project: ProjectAccessReadModel): void {
    this.router.navigate(['/projects', project.projectId]);
  }
}

