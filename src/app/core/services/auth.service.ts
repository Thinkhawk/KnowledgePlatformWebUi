import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CurrentUser } from '../models/auth.model';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAME_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser: CurrentUser | null = null;

  constructor() {
    this.loadFromStorage();
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.decodeToken(token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUser;
  }

  getCurrentRole(): string | null {
    return this.currentUser?.role ?? null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ProjectAdmin';
  }

  isLead(): boolean {
    const role = this.currentUser?.role;
    // ProjectAdmin has full access; ProjectLead manages teams in assigned projects
    return role === 'ProjectLead' || role === 'ProjectAdmin';
  }

  isMember(): boolean {
    return this.currentUser?.role === 'TeamMember';
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser = null;
  }

  private loadFromStorage(): void {
    const token = this.getToken();
    if (token) {
      this.decodeToken(token);
    }
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
}
