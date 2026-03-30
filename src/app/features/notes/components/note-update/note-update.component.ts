import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteUpdateForm } from './note-update.form';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteUpdateModel } from '../../models/note-update.model';
import { NoteReadModel } from '../../models/note-read.model';
import { AppHttpError } from '../../../../core/models/app-http-error.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'note-update',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './note-update.component.html',
  styleUrl: './note-update.component.css',
})
export class NoteUpdateComponent implements OnInit {

  noteUpdateForm: FormGroup<NoteUpdateForm>;
  validationErrors = signal<Record<string, string[]> | null>(null);

  noteReadModel = signal<NoteReadModel | null>(null);
  apiError = signal<string | null>(null);
  concurrencyError = signal<string | null>(null);
  noteId = signal<string | null>(null);
  teamId = signal<number | null>(null);

  private rowVersion!: string;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {
    this.noteUpdateForm = this.formBuilder.group<NoteUpdateForm>({

      title: this.formBuilder.control('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      }),

      content: this.formBuilder.control(null),

      tags: this.formBuilder.control(null)

    })
  }

  ngOnInit(): void {
    this.teamId.set(Number(this.activatedRoute.snapshot.paramMap.get('teamId')));
    this.noteId.set(this.activatedRoute.snapshot.paramMap.get('noteId'));
    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getByNoteId(this.noteId()!).subscribe({
      next: (data) => {
        this.noteReadModel.set(data);

        this.noteUpdateForm.patchValue({
          title: data.title,
          content: data.content,
          tags: '#'+data.tags?.join(" #"),
        });
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

  onSubmit(): void {

    if (this.noteUpdateForm.invalid) {
      this.noteUpdateForm.markAllAsTouched();
      return;
    }

    if (!this.noteReadModel()) return;

    const model: NoteUpdateModel = {
      noteId: this.noteReadModel()!.noteId,
      title: this.noteUpdateForm.controls.title.value,
      content: this.noteUpdateForm.controls.content.value,
      tags: this.noteUpdateForm.controls.tags.value?.replaceAll(" ","").split('#') ?? null,
      updaterId: this.authService.getPayload()?.unique_name!,
      rowVersion: this.noteReadModel()!.rowVersion
    };

    this.noteService.update(this.noteId()!,model).subscribe({
      next: () => {
        this.router.navigate(['/', this.teamId()])
      },

      error: (error) => {
        if (error.validationErrors) {
          this.validationErrors.set(error.validationErrors);
          return;
        }
        this.apiError.set(error.detail);
      }
    })
  }

}
