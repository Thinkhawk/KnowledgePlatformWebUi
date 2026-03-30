import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserAccessService } from '../services/user-access.service';
import { NoteService } from '../../features/notes/services/note.service';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';
import { NoteReadModel } from '../../features/notes/models/note-read.model';


export const noteGuard: CanActivateFn = (route, state) => {

  const userAccessService = inject(UserAccessService);
  const router = inject(Router);
  const noteService = inject(NoteService);
  const authService = inject(AuthService);

  const teamId = Number(route.paramMap.get('teamId') ?? route.parent?.paramMap.get('teamId'));
  const noteId = route.paramMap.get('noteId') ?? route.parent?.paramMap.get('noteId');
  const currentUserId = authService.getPayload()?.unique_name;

  const teamAccess = userAccessService.getTeamAccessMap().get(teamId);

  if (!currentUserId) {
    router.navigate(['/login']);
    return false;
  }

  if (userAccessService.getPayload()![0].hasFullProjectControl) {
    return true;
  }

  if (teamAccess == 1 && state.url.includes('create')) {
    return true;
  }

  return noteService.getByNoteId(noteId!).pipe(
    map((note: NoteReadModel) => {
      console.log(note.creatorId)
      console.log(currentUserId)
      console.log(note.creatorId === currentUserId)
      if (note.creatorId === currentUserId) {
        return true;
      }
      router.navigate(['/', teamId]);
      return false;
    }),
    catchError(() => {
      router.navigate(['/', teamId]);
      return of(false);
    })
  );

};
