import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const currentRole = authService.getCurrentRole();

  if (allowedRoles && currentRole && allowedRoles.includes(currentRole)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
