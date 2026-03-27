import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig } from '../config/app-config.interface';


@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {

  private readonly baseUrl: string;


  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) private readonly config: AppConfig
  ) {
    this.baseUrl = config.apiBaseUrl;
  }


  /**
   * Performs HTTP GET request.
   */
  protected get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }


  /**
   * Performs HTTP POST request.
   */
  protected post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Performs HTTP PUT request.
   */
  protected put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }


  /**
   * Performs HTTP DELETE request.
   */
  protected delete<T>(endpoint: string, body?: unknown): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      body
    });
  }

}
