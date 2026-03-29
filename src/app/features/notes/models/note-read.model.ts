export interface NoteReadModel {

  noteId: string;
  title: string;
  content: string | null;
  tags: string[] | null;
  teamId: number;
  creatorId: string;
  creatorName: string;
  createdAtUtc: Date;
  updaterId: string;
  updaterName: string;
  updatedAtUtc: Date;
  rowVersion: string;

}
