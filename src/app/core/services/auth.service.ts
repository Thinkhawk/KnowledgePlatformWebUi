import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { CreateUserModel, JwtPayload, LoginRequest, LoginResponse, ChangePasswordModel, UserReadModel } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { UserAccessService } from './user-access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiBaseService{

  private readonly loginUrl = `/auth/login`;
  private readonly tokenKey = 'auth_token';
  private readonly userAccessKey = 'user_accesses';


  private userAccessService = inject(UserAccessService);
  private router = inject(Router);

  login(request: LoginRequest): Observable<LoginResponse> {

    return super.post<LoginResponse>(this.loginUrl, request).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token!);
        this.setUserAccessesInLocalStorage();
      }),
    );
  }

  setUserAccessesInLocalStorage() {
    this.userAccessService.getUserAccessibleProjectsAndTeams(this.getPayload()?.unique_name!).subscribe({
      next: (projectAccessReadModel) => {
        localStorage.setItem(this.userAccessKey, JSON.stringify(projectAccessReadModel));
      }
    })
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userAccessKey);
    this.router.navigate(['/login']);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return jwtDecode<JwtPayload>(token);
  }


  getPermissions(): string[] {
    const payload = this.getPayload();
    if (!payload || !payload.permission) {
      return [];
    }
    return payload.permission;
  }


  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }


  isAuthenticated(): boolean {
    const payload = this.getPayload();
    if (!payload) {
      return false;
    }
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  }

  createUser(dto: CreateUserModel): Observable<string> {
    return super.post<string>('/auth/create-user', dto);
  }

  changeUserRole(dto: { username: string; oldRole: string; newRole: string; }): Observable<{ Message: string; Roles: string[] }> {
    return super.post<{ Message: string; Roles: string[] }>('/auth/change-role', dto);
  }

  changePassword(dto: ChangePasswordModel): Observable<string> {
    return super.post<string>('/auth/change-password', dto);
  }

  getProjectLeads(): Observable<UserReadModel[]> {
    return super.get<UserReadModel[]>('/auth/project-leads');
  }

  getTeamMembers(): Observable<UserReadModel[]> {
    return super.get<UserReadModel[]>('/auth/team-members');
  }

  getProjectAdmins(): Observable<UserReadModel[]> {
    return super.get<UserReadModel[]>('/auth/project-admins');
  }

  isSeededAdmin(): boolean {
    const payload = this.getPayload();
    if (!payload) return false;
    const username = payload.sub ?? '';
    const email = payload.email ?? '';
    return username.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@test.com';
  }

  deleteUser(username: string): Observable<string> {
    return super.delete<string>(`/auth/delete-user/${encodeURIComponent(username)}`);
  }
}

