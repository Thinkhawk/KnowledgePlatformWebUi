export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  token?: string;
}

export interface JwtPayload {
  sub: string;
  unique_name: string;
  email: string;
  exp: number;
  role?: string | string[];
  permission?: string[];
}

export interface CreateUserModel {
  username: string;
  email: string;
  password: string;
  role: string;
}
