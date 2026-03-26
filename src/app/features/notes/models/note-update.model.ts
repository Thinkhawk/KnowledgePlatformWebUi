export interface NoteUpdateModel {

  noteId: string;
  title: string;
  content: string | null;
  tags: string[] | null;
  rowVersion: string;

}
