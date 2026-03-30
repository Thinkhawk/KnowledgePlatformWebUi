import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiBaseService } from "../../../core/services/api-base.service";
import { Observable } from "rxjs";

import { NoteCreateModel } from "../models/note-create.model";
import { NoteReadModel } from "../models/note-read.model";
import { NoteUpdateModel } from "../models/note-update.model";
import { NoteDeleteModel } from "../models/note-delete.model";
import { NoteFilterModel } from "../models/note-filter.model";
import { toHttpParams } from "../../../core/helpers/http-params-helper";

@Injectable({
  providedIn: 'root'
})
export class NoteService extends ApiBaseService {

  getByNoteId(noteId: string): Observable<NoteReadModel> {
    return super.get<NoteReadModel>(`/notes/${noteId}`);
  }

  getByTeamId(teamId: number): Observable<NoteReadModel[]> {
    return super.get<NoteReadModel[]>(`/notes/${teamId}`);
  }

  getByFilters(teamId: number, noteFilterModel: NoteFilterModel) {
    return super.get<NoteReadModel[]>(`/notes/${teamId}/filter`, toHttpParams(noteFilterModel));
  }

  create(noteCreateModel: NoteCreateModel): Observable<NoteReadModel> {
    return super.post<NoteReadModel>('/notes', noteCreateModel);
  }

  update(noteId:string, noteUpdateModel: NoteUpdateModel): Observable<void> {
    return super.put<void>(`/notes/${noteId}`, noteUpdateModel);
  }

  remove(noteId: string, noteDeleteModel: NoteDeleteModel): Observable<void> {
    return super.delete<void>(`/notes/${noteId}`, noteDeleteModel);
  }
}
