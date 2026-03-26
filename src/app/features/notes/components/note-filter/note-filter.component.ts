import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { NoteFilterForm } from './note-filter.form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { NoteFilterModel } from '../../models/note-filter.model';
import { NoteReadModel } from '../../models/note-read.model';
import { ValidationProblemDetails } from '../../../../core/models/problem-details.model';

@Component({
  selector: 'note-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './note-filter.component.html',
  styleUrl: './note-filter.component.css',
})
export class NoteFilterComponent {

  noteFilterForm: FormGroup<NoteFilterForm>;

  @Input() teamId!: number | null;
  @Input() noteReadModels!: NoteReadModel[];
  @Output() filterEvent = new EventEmitter<NoteReadModel[]>();

  apiError = signal<string | null>(null);
  validationErrors: Record<string, string[]> = {};

  distinctNoteIds: string[] = [];
  distinctTitles: string[] = [];
  distinctTags: string[] = [];
  distinctUserIds: string[] = [];
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
      userId: this.formBuilder.control(null),
      createdAtUtc: this.formBuilder.control(null),
      updatedAtUtc: this.formBuilder.control(null)      

    });
  }

  ngOnInit(): void {
    this.initializeDatalists();
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
      this.distinctUserIds = [...new Set(this.noteReadModels.map(n => n.userId).filter(Boolean))];


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
      userId: this.noteFilterForm.controls.userId.value,
      createdAtUtc: this.noteFilterForm.controls.createdAtUtc.value,
      updatedAtUtc: this.noteFilterForm.controls.updatedAtUtc.value,
    }

    this.noteService.getByFilters(this.teamId!, model).subscribe({

      next: (data) => {
        this.filterEvent.emit(data);
        console.log("Notes fitered successfully.");
      },

      error: (error) => {
        if (error.error?.errors) {
          const problem = error.error as ValidationProblemDetails;
          this.validationErrors = problem.errors;
          return;
        }
        this.apiError.set(error.error?.detail ?? 'An unexpected error occured while filterig the notes.');
      }

    });
  }

}
