import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { AppConfig } from '../../../core/config/app-config.interface';
import { Project, ProjectCreateRequest, ProjectUpdateRequest, ProjectDeleteRequest } from '../models/project.model';
import { Team, TeamCreateRequest, TeamUpdateRequest, TeamDeleteRequest } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class ProjectService extends ApiBaseService {

  constructor(http: HttpClient, @Inject(APP_CONFIG) config: AppConfig) {
    super(http, config);
  }

  // ── Projects ──

  getProjects(): Observable<Project[]> {
    return this.get<Project[]>('/projects');
  }

  getProjectById(id: number): Observable<Project> {
    return this.get<Project>(`/projects/${id}`);
  }

  createProject(data: ProjectCreateRequest): Observable<unknown> {
    return this.post('/projects', data);
  }

  updateProject(id: number, data: ProjectUpdateRequest): Observable<unknown> {
    return this.put(`/projects/${id}`, data);
  }

  deleteProject(id: number, data: ProjectDeleteRequest): Observable<unknown> {
    return this.delete(`/projects/${id}`, data);
  }

  // ── Teams ──

  getTeamsByProject(projectId: number): Observable<Team[]> {
    return this.get<Team[]>(`/projects/${projectId}/teams`);
  }

  getTeamById(teamId: number): Observable<Team> {
    return this.get<Team>(`/teams/${teamId}`);
  }

  createTeam(data: TeamCreateRequest): Observable<unknown> {
    return this.post('/teams', data);
  }

  updateTeam(id: number, data: TeamUpdateRequest): Observable<unknown> {
    return this.put(`/teams/${id}`, data);
  }

  deleteTeam(id: number, data: TeamDeleteRequest): Observable<unknown> {
    return this.delete(`/teams/${id}`, data);
  }
}
