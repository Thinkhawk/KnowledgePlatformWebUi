import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { CreateUserModel, JwtPayload, LoginRequest, LoginResponse } from '../models/auth.model';
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
}

