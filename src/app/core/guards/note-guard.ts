import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { UserAccessService } from '../services/user-access.service';


export const noteGuard: CanActivateFn = (route, state) => {

  const userAccessService = inject(UserAccessService);
  const router = inject(Router);

  const teamId = Number(route.paramMap.get('teamId') ?? route.parent?.paramMap.get('teamId'))

  const teamAccess = userAccessService.getTeamAccessMap().get(teamId);

  if (teamAccess == 1) {
    return true;
  }

  router.navigate(['/', teamId]);

  return false;

};
