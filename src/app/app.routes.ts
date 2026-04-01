import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/projects/components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/components/project-list/project-list.component')
        .then(m => m.ProjectListComponent),
    canActivate: [authGuard]
  },

  {
    path: 'projects/create',
    loadComponent: () =>
      import('./features/projects/components/project-create/project-create.component')
        .then(m => m.ProjectCreateComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ProjectAdmin'] }
  },

  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./features/projects/components/project-detail/project-detail.component')
        .then(m => m.ProjectDetailComponent),
    canActivate: [authGuard]
  },

  {
    path: 'projects/:id/edit',
    loadComponent: () =>
      import('./features/projects/components/project-edit/project-edit.component')
        .then(m => m.ProjectEditComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ProjectAdmin'] }
  },

  {
    path: 'projects/:id/teams/create',
    loadComponent: () =>
      import('./features/projects/components/team-create/team-create.component')
        .then(m => m.TeamCreateComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ProjectAdmin', 'ProjectLead'] }
  },

  {
    path: 'projects/:id/teams/:teamId',
    loadComponent: () =>
      import('./features/projects/components/team-detail/team-detail.component')
        .then(m => m.TeamDetailComponent),
    canActivate: [authGuard]
  },

  {
    path: 'projects/:id/teams/:teamId/edit',
    loadComponent: () =>
      import('./features/projects/components/team-edit/team-edit.component')
        .then(m => m.TeamEditComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ProjectAdmin', 'ProjectLead'] }
  },

  {
    path: 'admin/users/create',
    loadComponent: () =>
      import('./features/admin/components/create-user/create-user.component')
        .then(m => m.CreateUserComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ProjectAdmin'] }
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
