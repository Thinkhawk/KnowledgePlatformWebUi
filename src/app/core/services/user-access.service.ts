import { Injectable } from "@angular/core";
import { ApiBaseService } from "./api-base.service";
import { Observable } from "rxjs";
import { ProjectAccessReadModel, TeamAccessReadModel } from "../models/user-access.model";


export interface TeamAccessMap {
  teamId: number;
  accessLevel: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserAccessService extends ApiBaseService {

  private readonly userAccessKey = 'user_accesses';

  getUserAccessibleProjectsAndTeams(userId: string): Observable<ProjectAccessReadModel> {
    return super.get<ProjectAccessReadModel>(`/userAccess/${userId}`);
  }


  getUserAccess() {
    return localStorage.getItem(this.userAccessKey);
  }

  getPayload(): ProjectAccessReadModel[] | null {
    const userAccess = this.getUserAccess();
    if (!userAccess) return null;
    return JSON.parse(userAccess) as ProjectAccessReadModel[];
  }

  private getTeamAccessList(): { teamId: number; accessLevel: number }[] {
    const payload = this.getPayload();

    if (!payload || !Array.isArray(payload)) {
      return [];
    }

    // Explicitly typing 'project' allows TS to know 'project.teams' is TeamAccessInfoDto[]
    return payload.flatMap((project: ProjectAccessReadModel) =>
      project.teams.map((team: TeamAccessReadModel) => ({
        teamId: team.teamId,
        accessLevel: team.accessLevel
      }))
    );
  }

  getTeamAccessMap(): Map<number, number> {
    const teamAccessList = this.getTeamAccessList();

    return new Map<number, number>(
      teamAccessList.map(item => [item.teamId, item.accessLevel])
    );
  }

}
