import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { CreateUserComponent } from './features/auth/components/create-user/create-user.component';

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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
