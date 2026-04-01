import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProjectAccessReadModel } from '../models/user-access.model';
import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig } from '../config/app-config.interface';

@Injectable({ providedIn: 'root' })
export class SidebarService {

  private readonly baseUrl: string;
  private readonly projectsSubject = new BehaviorSubject<ProjectAccessReadModel[]>([]);
  readonly projects$: Observable<ProjectAccessReadModel[]> = this.projectsSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.baseUrl = config.apiBaseUrl;
  }

  loadTree(userId: string): void {
    this.http.get<ProjectAccessReadModel[]>(`${this.baseUrl}/useraccess/${userId}`)
      .pipe(map(res => res ?? []))
      .subscribe(projects => this.projectsSubject.next(projects));
  }

  refresh(userId: string): void {
    this.loadTree(userId);
  }

  getProjects(): ProjectAccessReadModel[] {
    return this.projectsSubject.value;
  }
}
