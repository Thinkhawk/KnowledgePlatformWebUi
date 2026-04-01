import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { CreateUserModel, JwtPayload, LoginRequest, LoginResponse, ChangePasswordModel, UserReadModel } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { UserAccessService } from './user-access.service';
import { CurrentUser } from '../models/auth.model';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAME_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiBaseService {

  private readonly loginUrl = `/auth/login`;
  private readonly tokenKey = 'auth_token';
  private readonly userAccessKey = 'user_accesses';

  private currentUser: CurrentUser | null = null;

  private userAccessService = inject(UserAccessService);
  private router = inject(Router);

  private _initializer = this.loadFromStorage();

  login(request: LoginRequest): Observable<LoginResponse> {

    return super.post<LoginResponse>(this.loginUrl, request).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token!);
        this.setUserAccessesInLocalStorage();
        this.decodeToken(response.token!);
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

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.decodeToken(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userAccessKey);
    this.currentUser = null;
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

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUser;
  }

  getCurrentRole(): string | null {
    return this.currentUser?.role ?? null;
  }

  isAuthenticated(): boolean {
    const payload = this.getPayload();
    if (!payload) {
      return false;
    }
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ProjectAdmin';
  }

  createUser(dto: CreateUserModel): Observable<string> {
    return super.post<string>('/auth/create-user', dto);
  }

  isLead(): boolean {
    const role = this.currentUser?.role;
    // ProjectAdmin has full access; ProjectLead manages teams in assigned projects
    return role === 'ProjectLead' || role === 'ProjectAdmin';
  }

  changeUserRole(dto: { username: string; oldRole: string; newRole: string; }): Observable<{ Message: string; Roles: string[] }> {
    return super.post<{ Message: string; Roles: string[] }>('/auth/change-role', dto);
  }

  isMember(): boolean {
    return this.currentUser?.role === 'TeamMember';
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

  private loadFromStorage(): void {
    const token = this.getToken();
    if (token) {
      this.decodeToken(token);
    }
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

  private decodeToken(token: string): void {
    try {
      const decoded: Record<string, unknown> = jwtDecode(token);
      this.currentUser = {
        userId: decoded[NAME_ID_CLAIM] as string ?? '',
        username: decoded['sub'] as string ?? '',
        email: decoded[EMAIL_CLAIM] as string ?? '',
        role: decoded[ROLE_CLAIM] as string ?? ''
      };
    } catch {
      this.currentUser = null;
    }
  }

  deleteUser(username: string): Observable<string> {
    return super.delete<string>(`/auth/delete-user/${encodeURIComponent(username)}`);
  }
}

