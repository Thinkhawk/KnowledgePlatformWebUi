import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { CreateUserComponent } from './features/auth/components/create-user/create-user.component';
import { NoteReadComponent } from './features/notes/components/note-read/note-read.component';
import { NoteCreateComponent } from './features/notes/components/note-create/note-create.component';
import { NoteDeleteComponent } from './features/notes/components/note-delete/note-delete.component';
import { NoteUpdateComponent } from './features/notes/components/note-update/note-update.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'create-user',
    component: CreateUserComponent
  },
  {
    path: ':teamId',
    component: NoteReadComponent,
  },
  {
    path: ':teamId/createNote',
    component: NoteCreateComponent,
  },
  {
    path: ':teamId/delete/:noteId',
    component: NoteDeleteComponent
  },
  {
    path: ':teamId/edit/:noteId',
    component: NoteUpdateComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
