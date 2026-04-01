import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { AppConfig } from '../../../core/config/app-config.interface';
import { TeamMember, TeamAccessCreateRequest, TeamAccessDeleteRequest, UserSearchResult } from '../models/team-access.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TeamAccessService extends ApiBaseService {

  constructor(http: HttpClient, @Inject(APP_CONFIG) config: AppConfig) {
    super(http, config);
  }

  getTeamMembers(teamId: number): Observable<TeamMember[]> {
    const params = new HttpParams().set('teamId', teamId);
    return this.get<TeamMember[]>('/teamaccess', params);
  }

  searchUsers(term: string): Observable<UserSearchResult[]> {
    const params = new HttpParams().set('search', term);
    return this.get<UserSearchResult[]>('/users', params);
  }

  searchUserByEmail(email: string): Observable<UserSearchResult> {
    const params = new HttpParams().set('email', email);
    return this.get<UserSearchResult>('/users/search', params);
  }

  assignMember(data: TeamAccessCreateRequest): Observable<unknown> {
    return this.post('/teamaccess', data);
  }

  removeMember(accessId: number, data: TeamAccessDeleteRequest): Observable<unknown> {
    return this.delete(`/teamaccess/${accessId}`, data);
  }
}
