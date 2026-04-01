export interface TeamAccessItem {
  teamId: number;
  teamName: string;
  accessLevel: string;
  isTeamCreator?: boolean;
}

export interface ProjectAccessItem {
  projectId: number;
  projectName: string;
  description?: string;
  isProjectCreator?: boolean;
  canManageTeams?: boolean;   // true for ProjectAdmin and ProjectLead (assigned projects); false for TeamMember
  teams: TeamAccessItem[];
}
