export interface Team {
  teamId: number;
  projectId: number;
  name: string;
  creatorId: string;
  createdAtUtc: string;
  updatedAtUtc?: string;
  rowVersion: string;
}

export interface TeamCreateRequest {
  projectId: number;
  name: string;
  creatorId: string;
}

export interface TeamUpdateRequest {
  teamId: number;
  name: string;
  rowVersion: string;
}

export interface TeamDeleteRequest {
  teamId: number;
  rowVersion: string;
}
