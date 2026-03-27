import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserAccessService } from '../services/user-access.service';


/**
 * Permission Guard
 *
 * Prevents access to routes if the user does not have the required permission.
 */
export const permissionGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const userAccessService = inject(UserAccessService);
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);
  const requiredPermission = route.data?.['permission'];

  const teamAccess = userAccessService.getTeamAccessMap().get(Number(activatedRoute.snapshot.paramMap.get('teamId')));
  if (teamAccess==0)

  if (!requiredPermission) {
    return true;
  }

  if (authService.hasPermission(requiredPermission)) {
    return true;
  }

  router.navigate(['/']);

  return false;

};
