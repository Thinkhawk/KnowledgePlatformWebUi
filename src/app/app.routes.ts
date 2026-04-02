import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { CreateUserComponent } from './features/auth/components/create-user/create-user.component';
import { NoteReadComponent } from './features/notes/components/note-read/note-read.component';
import { NoteCreateComponent } from './features/notes/components/note-create/note-create.component';
import { NoteDeleteComponent } from './features/notes/components/note-delete/note-delete.component';
import { NoteUpdateComponent } from './features/notes/components/note-update/note-update.component';
import { authGuard } from './core/guards/auth-guard';
import { NoteViewComponent } from './features/notes/components/note-view/note-view.component';
import { noteGuard } from './core/guards/note-guard';
import { seedGuard } from './core/guards/seed-guard';
import { roleGuard } from './core/guards/role.guard';
import { adminGuard } from './core/guards/admin-guard';

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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: NoteReadComponent,
        canActivate: [authGuard],
        children: [
          {
            path: 'delete/:noteId',
            component: NoteDeleteComponent,
            canActivate: [authGuard, noteGuard]
          }
        ]
      },
      {
        path: 'createNote',
        component: NoteCreateComponent,
        canActivate: [authGuard, noteGuard]
      },
      {
        path: 'edit/:noteId',
        component: NoteUpdateComponent,
        canActivate: [authGuard, noteGuard]
      },
      {
        path: ':view/:noteId',
        component: NoteViewComponent,
        canActivate: [authGuard],
        children: [
          {
            path: 'delete',
            component: NoteDeleteComponent,
            canActivate: [authGuard, noteGuard]
          }
        ]
      },
    ]

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
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./features/auth/components/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [authGuard, seedGuard]
  },
  {
    path: 'change-password',
    loadComponent: () => import('./features/auth/components/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/users/create',
    loadComponent: () =>
      import('./features/admin/components/create-user/create-user.component')
        .then(m => m.CreateUserComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ProjectAdmin'] }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
