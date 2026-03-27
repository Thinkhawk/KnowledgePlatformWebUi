import { Injectable } from "@angular/core";
import { ApiBaseService } from "./api-base.service";
import { Observable } from "rxjs";
import { ProjectAccessReadModel } from "../models/user-access.model";

@Injectable({
  providedIn: 'root'
})
export class UserAccessService extends ApiBaseService {

  getUserAccessibleProjectsAndTeams(userId: string): Observable<ProjectAccessReadModel> {
    return super.get<ProjectAccessReadModel>(`/userAccess/${userId}`);
  }
}
