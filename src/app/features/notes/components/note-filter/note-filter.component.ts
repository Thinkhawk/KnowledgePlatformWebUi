import { Component, computed, input, signal, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NoteFilterForm } from './note-filter.form';
import { NoteService } from '../../services/note.service';
import { NoteFilterModel } from '../../models/note-filter.model';
import { NoteReadModel } from '../../models/note-read.model';

@Component({
  selector: 'note-filter',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-filter.component.html',
  styleUrl: './note-filter.component.css',
})
export class NoteFilterComponent {

  teamId = input<number | null>(null);
  noteReadModels = input<NoteReadModel[]>([]);
  @Output() filterEvent = new EventEmitter<NoteReadModel[]>();

  apiError = signal<string | null>(null);
  validationErrors = signal<Record<string, string[]> | null>(null);

  noteFilterForm: FormGroup<NoteFilterForm>;

  distinctNoteIds = computed(() =>
    [...new Set(this.noteReadModels().map(n => n.noteId).filter(Boolean))]
  );

  distinctTitles = computed(() =>
    [...new Set(this.noteReadModels().map(n => n.title).filter(Boolean))]
  );

  distinctCreators = computed(() =>
    [...new Set(this.noteReadModels().map(n => n.creatorName).filter(Boolean))]
  );

  distinctUpdaters = computed(() =>
    [...new Set(this.noteReadModels().map(n => n.updaterName).filter(Boolean))]
  );

  distinctTags = computed(() => {
    const allTags = this.noteReadModels().flatMap(n => n.tags || []);
    return [...new Set(allTags)];
  });

  distinctCreatedAtUtc = computed(() =>
    [...new Set(this.noteReadModels()
      .map(n => n.createdAtUtc ? new Date(n.createdAtUtc).toISOString().split('T')[0] : null)
      .filter(Boolean) as string[])]
  );

  distinctUpdatedAtUtc = computed(() =>
    [...new Set(this.noteReadModels()
      .map(n => n.updatedAtUtc ? new Date(n.updatedAtUtc).toISOString().split('T')[0] : null)
      .filter(Boolean) as string[])]
  );

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private router: Router
  ) {
    this.noteFilterForm = this.formBuilder.group<NoteFilterForm>({
      noteId: this.formBuilder.control(null),
      title: this.formBuilder.control(null),
      tags: this.formBuilder.control(null),
      creatorName: this.formBuilder.control(null),
      updaterName: this.formBuilder.control(null),
      createdAtUtc: this.formBuilder.control(null),
      updatedAtUtc: this.formBuilder.control(null)
    });
  }

  setControlValue(controlName: keyof NoteFilterForm, value: string): void {
    this.noteFilterForm.get(controlName)?.setValue(value);
  }

  onSubmit(): void {
    if (this.noteFilterForm.invalid) {
      this.noteFilterForm.markAllAsTouched();
      return;
    }

    const formValues = this.noteFilterForm.value;

    const model: NoteFilterModel = {
      noteId: formValues.noteId ?? null,
      title: formValues.title ?? null,
      tags: formValues.tags?.split("#").filter(t => t.trim() !== "") ?? null,
      creatorName: formValues.creatorName ?? null,
      updaterName: formValues.updaterName ?? null,
      createdAtUtc: formValues.createdAtUtc ?? null,
      updatedAtUtc: formValues.updatedAtUtc ?? null,
    };

    this.noteService.getByFilters(this.teamId()!, model).subscribe({
      next: (data) => {
        this.filterEvent.emit(data);
      },
      error: (error) => {
        if (error.validationErrors) {
          this.validationErrors.set(error.validationErrors);
          return;
        }
        this.apiError.set(error.detail || "An error occurred while filtering.");
      }
    });
  }

  onClear() {
    this.noteFilterForm.reset();
    this.onSubmit();
  }
}
