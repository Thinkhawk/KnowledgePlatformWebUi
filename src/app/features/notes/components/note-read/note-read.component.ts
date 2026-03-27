import { AfterContentChecked, Component, OnInit, signal } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NoteReadModel } from '../../models/note-read.model';
import { AppHttpError } from '../../../../core/models/app-http-error.model';
import { CommonModule } from '@angular/common';
import { NoteFilterComponent } from '../note-filter/note-filter.component';
import { UserAccessService } from '../../../../core/services/user-access.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'note-read',
  imports: [CommonModule, RouterLink, NoteFilterComponent, RouterOutlet],
  templateUrl: './note-read.component.html',
  styleUrl: './note-read.component.css',
})
export class NoteReadComponent implements OnInit{

  apiError = signal<string | null>(null);
  noteReadModels = signal<NoteReadModel[]>([]);
  teamId = signal<number | null>(null);
  hasWriteAccess = signal<boolean>(false);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private noteService: NoteService,
    private userAccessService: UserAccessService,
    readonly authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.teamId.set(Number(this.activatedRoute.snapshot.paramMap.get('teamId')));
    this.loadNotes();
    this.setWriteAccess();
  }

  setWriteAccess() {
    let chk1 = this.userAccessService.getTeamAccessMap().get(this.teamId()!) == 1;
    let chk2 = this.userAccessService.getPayload()![0].hasFullProjectControl;
    this.hasWriteAccess.set(chk1||chk2);
  }

  loadNotes() {
    this.noteService.getByTeamId(this.teamId()!).subscribe({
      next: (data) => {
        this.noteReadModels.set(data);
      },
      error: (error: AppHttpError) => {
        if (error.detail) {
          this.apiError.set(error.detail);
        } else {
          this.apiError.set('Failed to load notes.');
        }

      }
    })
  }

  handleFilterEvent(data: NoteReadModel[]) {
    this.noteReadModels.set(data);
  }

}
