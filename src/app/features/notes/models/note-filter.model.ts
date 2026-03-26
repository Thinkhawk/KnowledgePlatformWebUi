export interface NoteFilterModel {

  noteId: string | null;
  title: string | null;
  tags: string[] | null;
  userId: string | null;
  createdAtUtc: Date | null;
  updatedAtUtc: Date | null;

}
