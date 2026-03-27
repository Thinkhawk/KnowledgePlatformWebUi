import { Component, OnInit, signal } from '@angular/core';
import { NoteReadModel } from '../../models/note-read.model';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppHttpError } from '../../../../core/models/app-http-error.model';
import { NoteDeleteModel } from '../../models/note-delete.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'note-delete',
  imports: [CommonModule,RouterLink],
  templateUrl: './note-delete.component.html',
  styleUrl: './note-delete.component.css',
})
export class NoteDeleteComponent implements OnInit {

  noteReadModel = signal<NoteReadModel | null>(null);
  apiError = signal<string | null>(null);
  concurrencyError = signal<string | null>(null);

  private noteId = signal<string | null>(null);

  constructor(
    private noteService: NoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.noteId.set(String(this.activatedRoute.snapshot.paramMap.get('noteId')));
    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getByNoteId(this.noteId()!).subscribe({
      next: (data) => {
        this.noteReadModel.set(data);
      },
      error: (error: AppHttpError) => {
        if (error.detail) {
          this.apiError.set(error.detail);
        } else {
          this.apiError.set('Failed to load note.');
        }

      }
    });
  }

  confirmDelete(): void {
    if (!this.noteReadModel) return;

    const noteDeleteModel: NoteDeleteModel = {
      noteId: this.noteReadModel()!.noteId,
      rowVersion: this.noteReadModel()!.rowVersion
    };

    this.noteService.remove(this.noteId()!,noteDeleteModel).subscribe({
      next: () => {
        this.router.navigate(['/', this.noteReadModel()?.teamId])
      },
      error: (error) => {
        if (error.isConcurrencyError) {
          this.concurrencyError.set(error.detail);
        } else {
          this.apiError.set(error.detail ?? 'Failed to load notes.');
        }
      }
    })
  }

}
