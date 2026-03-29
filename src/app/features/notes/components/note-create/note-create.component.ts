import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NoteCreateForm } from './note-create.form';
import { NoteService } from '../../services/note.service';
import { NoteCreateModel } from '../../models/note-create.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'note-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './note-create.component.html',
  styleUrl: './note-create.component.css',
})
export class NoteCreateComponent implements OnInit {

  noteCreateForm: FormGroup<NoteCreateForm>;
  validationErrors=signal<Record<string, string[]>|null>(null);
  apiError = signal<string | null>(null);

  teamId=signal<number | null>(null);
  userId=signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private authService: AuthService,
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

      content: this.formBuilder.control(null, {
        nonNullable: false
      }),

      tags: this.formBuilder.control(null, {
        nonNullable:false
      }),

      teamId: this.formBuilder.control(this.teamId(), {
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
      tags: this.noteCreateForm.controls.tags.value?.replaceAll(" ","").split('#') ?? null,
      teamId: this.noteCreateForm.controls.teamId.value!,
      creatorId: this.authService.getPayload()?.unique_name!
    }

    this.noteService.create(model).subscribe({
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

    console.log(this.noteCreateForm.invalid);

  }

}
