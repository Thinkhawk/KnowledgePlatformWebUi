import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { CreateUserComponent } from './features/auth/components/create-user/create-user.component';
import { NoteReadComponent } from './features/notes/components/note-read/note-read.component';
import { NoteCreateComponent } from './features/notes/components/note-create/note-create.component';
import { NoteDeleteComponent } from './features/notes/components/note-delete/note-delete.component';
import { NoteUpdateComponent } from './features/notes/components/note-update/note-update.component';
import { authGuard } from './core/guards/auth-guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard]
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [authGuard]
  },
  {
    path: ':teamId',
    component: NoteReadComponent,
  canActivate: [authGuard],
    children: [
      {
        path: 'delete/:noteId',
        component: NoteDeleteComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: ':teamId/createNote',
    component: NoteCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: ':teamId/edit/:noteId',
    component: NoteUpdateComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
