import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { NoteReadModel } from '../../models/note-read.model';
import { AppHttpError } from '../../../../core/models/app-http-error.model';
import { UserAccessService } from '../../../../core/services/user-access.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-note-view',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './note-view.component.html',
  styleUrl: './note-view.component.css',
})
export class NoteViewComponent implements OnInit {
  note = signal<NoteReadModel | null>(null);
  apiError = signal<string | null>(null);
  teamId = signal<number | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private noteService: NoteService,
    private userAccessService: UserAccessService,
    readonly authService: AuthService

  ) { }

  ngOnInit(): void {
    const noteId = this.activatedRoute.snapshot.paramMap.get('noteId');
    const teamIdParam = this.activatedRoute.snapshot.paramMap.get('teamId');

    if (teamIdParam) {
      this.teamId.set(Number(teamIdParam));
    }

    if (noteId) {
      this.loadNote(noteId);
    }
  }

  loadNote(noteId: string): void {
    this.noteService.getByNoteId(noteId).subscribe({
      next: (data) => {
        this.note.set(data);
      },
      error: (error: AppHttpError) => {
        this.apiError.set(error.detail || 'Failed to load note details.');
      }
    });
  }

  hasEditDeleteAccess(noteCreatorCheck: boolean): boolean {
    let writeAccessCheck = this.userAccessService.getTeamAccessMap().get(this.teamId()!) == 1;
    let fullControlCheck = this.userAccessService.getPayload()![0].hasFullProjectControl;
    return ((noteCreatorCheck && writeAccessCheck) || fullControlCheck);
  }
}
