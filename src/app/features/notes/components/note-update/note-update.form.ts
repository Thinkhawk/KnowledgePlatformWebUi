import { FormArray, FormControl } from '@angular/forms';

export interface NoteUpdateForm {

  title: FormControl<string>;
  content: FormControl<string | null>;
  tags: FormControl<string | null>;
  teamId: FormControl<number | null>;
  userId: FormControl<string | null>;

}
