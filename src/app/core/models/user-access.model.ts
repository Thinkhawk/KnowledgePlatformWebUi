export interface ProjectAccessReadModel {
  projectId: number;
  projectName: string;
  description: string | null;
  isProjectCreator: boolean;
  hasFullProjectControl: boolean;
  teams: TeamAccessReadModel[];
}

export interface TeamAccessReadModel {
  teamId: number;
  teamName: string;
  accessLevel: number;
  isTeamCreator: boolean;
}
