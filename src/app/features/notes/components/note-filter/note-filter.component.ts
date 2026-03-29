import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { NoteFilterForm } from './note-filter.form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { NoteFilterModel } from '../../models/note-filter.model';
import { NoteReadModel } from '../../models/note-read.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'note-filter',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-filter.component.html',
  styleUrl: './note-filter.component.css',
})
export class NoteFilterComponent implements OnChanges {

  noteFilterForm: FormGroup<NoteFilterForm>;

  @Input() teamId!: number | null;
  @Input() noteReadModels!: NoteReadModel[];
  @Output() filterEvent = new EventEmitter<NoteReadModel[]>();

  apiError = signal<string | null>(null);
  validationErrors = signal<Record<string, string[]> | null>(null);

  distinctNoteIds: string[] = [];
  distinctTitles: string[] = [];
  distinctTags: string[] = [];
  distinctCreators: string[] = [];
  distinctUpdaters: string[] = [];
  distinctCreatedAtUtc: string[] = [];
  distinctUpdatedAtUtc: string[] = [];

  private isInitialized = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    // Initialize lists only once when data first arrives
    if (!this.isInitialized && this.noteReadModels && this.noteReadModels.length > 0) {
      this.initializeDatalists();
      this.isInitialized = true;
    }
  }

  private initializeDatalists() {
    if (this.noteReadModels && this.distinctTitles.length === 0) {
      this.distinctNoteIds = [...new Set(this.noteReadModels.map(n => n.noteId).filter(Boolean))];
      this.distinctTitles = [...new Set(this.noteReadModels.map(n => n.title).filter(Boolean))];
      this.distinctCreators = [...new Set(this.noteReadModels.map(n => n.creatorName).filter(Boolean))];
      this.distinctUpdaters = [...new Set(this.noteReadModels.map(n => n.updaterName).filter(Boolean))];


      this.distinctCreatedAtUtc = [...new Set(this.noteReadModels
        .map(n => n.createdAtUtc ? new Date(n.createdAtUtc).toISOString().split('T')[0] : null)
        .filter(Boolean) as string[])];

      this.distinctUpdatedAtUtc = [...new Set(this.noteReadModels
        .map(n => n.updatedAtUtc ? new Date(n.updatedAtUtc).toISOString().split('T')[0] : null)
        .filter(Boolean) as string[])];

      const allTags = this.noteReadModels.flatMap(n => n.tags || []);
      this.distinctTags = [...new Set(allTags)];
    }
  }

  setControlValue(controlName: keyof NoteFilterForm, value: string): void {
    this.noteFilterForm.get(controlName)?.setValue(value);
  }

  onSubmit(): void {
    if (this.noteFilterForm.invalid) {
      this.noteFilterForm.markAllAsTouched();
      return;
    }

    let model: NoteFilterModel = {
      noteId: this.noteFilterForm.controls.noteId.value,
      title: this.noteFilterForm.controls.title.value,
      tags: this.noteFilterForm.controls.tags.value?.split("#") ?? null,
      creatorName: this.noteFilterForm.controls.creatorName.value,
      updaterName: this.noteFilterForm.controls.updaterName.value,
      createdAtUtc: this.noteFilterForm.controls.createdAtUtc.value,
      updatedAtUtc: this.noteFilterForm.controls.updatedAtUtc.value,
    }

    this.noteService.getByFilters(this.teamId!, model).subscribe({

      next: (data) => {
        this.filterEvent.emit(data);
        console.log("Notes fitered successfully.");
      },

      error: (error) => {
        if (error.validationErrors) {
          this.validationErrors.set(error.validationErrors);
          return;
        }
        this.apiError.set(error.detail);
      }

    });
  }

  onClear() {
    this.noteFilterForm.reset();
    this.onSubmit();
  }
}
