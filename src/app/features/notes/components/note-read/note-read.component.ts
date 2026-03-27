import { AfterContentChecked, Component, OnInit, signal } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NoteReadModel } from '../../models/note-read.model';
import { AppHttpError } from '../../../../core/models/app-http-error.model';
import { CommonModule } from '@angular/common';
import { NoteFilterComponent } from '../note-filter/note-filter.component';

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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private noteService: NoteService
  ) {

  }

  ngOnInit(): void {
    this.teamId.set(Number(this.activatedRoute.snapshot.paramMap.get('teamId')));
    this.loadNotes();
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
