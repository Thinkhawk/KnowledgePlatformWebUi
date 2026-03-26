import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NoteCreateForm } from './note-create.form';
import { NoteService } from '../../services/note.service';
import { NoteCreateModel } from '../../models/note-create.model';
import { ValidationProblemDetails } from '../../../../core/models/problem-details.model';

@Component({
  selector: 'note-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './note-create.component.html',
  styleUrl: './note-create.component.css',
})
export class NoteCreateComponent {

  noteCreateForm: FormGroup<NoteCreateForm>;
  validationErrors: Record<string, string[]> = {};
  apiError = signal<string | null>(null);

  teamId=signal<number | null>(null);
  userId=signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.noteCreateForm = this.formBuilder.group<NoteCreateForm>({

      title: this.formBuilder.control('', {
        nonNullable:true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      }),

      content: this.formBuilder.control(null),

      tags: this.formBuilder.control(null),

      teamId: this.formBuilder.control(this.teamId(), {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }),

      userId: this.formBuilder.control(this.userId(), {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      })

    })
  }

  ngOnInit(): void {
    this.teamId.set(Number(this.activatedRoute.snapshot.paramMap.get('teamId')));
    this.noteCreateForm.patchValue({
      teamId: this.teamId()
    });
  }

  onSubmit(): void {

    if (this.noteCreateForm.invalid) {
      this.noteCreateForm.markAllAsTouched();
      return;
    }

    const model: NoteCreateModel = {
      title: this.noteCreateForm.controls.title.value,
      content: this.noteCreateForm.controls.content.value,
      tags: this.noteCreateForm.controls.tags.value?.split('#') ?? null,
      teamId: this.noteCreateForm.controls.teamId.value!,
      userId: this.noteCreateForm.controls.userId.value!,
    }

    this.noteService.create(model).subscribe({
      next: () => {
        this.router.navigate(['/', this.teamId()])
      },

      error: (error) => {
        if (error.error?.errors) {
          const problem = error.error as ValidationProblemDetails;
          this.validationErrors = problem.errors;
          return;
        }
        this.apiError.set(error.error?.detail ?? 'An unexpected error occured while creating the note.');
      }
    })
  }

}
