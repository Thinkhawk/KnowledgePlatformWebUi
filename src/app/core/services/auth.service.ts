import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private api: ApiBaseService) { }

  login(dto: LoginDto): Observable<LoginResponse> {
    return this.api.postFor<LoginResponse>('/auth/login', dto);
  }

  createUser(dto: CreateUserDto): Observable<string> {
    return this.api.postFor<string>('/auth/create-user', dto);
  }
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
}

