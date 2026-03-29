export interface NoteCreateModel {

  title: string;
  content: string | null;
  tags: string[] | null;
  teamId: number;
  creatorId: string;

}
