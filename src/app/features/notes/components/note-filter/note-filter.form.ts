import { FormControl } from "@angular/forms";

export interface NoteFilterForm {
  noteId: FormControl<string | null>;
  title: FormControl<string | null>;
  tags: FormControl<string | null>;
  creatorName: FormControl<string | null>;
  updaterName: FormControl<string | null>;
  createdAtUtc: FormControl<Date | null>;
  updatedAtUtc: FormControl<Date | null>;
}
