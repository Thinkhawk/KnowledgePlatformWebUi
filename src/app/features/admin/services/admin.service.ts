import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { AppConfig } from '../../../core/config/app-config.interface';

export interface CreateUserRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService extends ApiBaseService {

  constructor(http: HttpClient, @Inject(APP_CONFIG) config: AppConfig) {
    super(http, config);
  }

  createUser(data: CreateUserRequest): Observable<unknown> {
    return this.post('/auth/create-user', data);
  }
}
