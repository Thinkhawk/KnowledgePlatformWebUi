export interface NoteFilterModel {

  noteId: string | null;
  title: string | null;
  tags: string[] | null;
  creatorName: string | null;
  updaterName: string | null;
  createdAtUtc: Date | null;
  updatedAtUtc: Date | null;

}
