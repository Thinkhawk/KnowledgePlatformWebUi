export interface Project {
  projectId: number;
  name: string;
  description?: string;
  creatorId: string;
  createdAtUtc: string;
  updatedAtUtc?: string;
  rowVersion: string;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  creatorId: string;
}

export interface ProjectUpdateRequest {
  projectId: number;
  name: string;
  description?: string;
  rowVersion: string;
}

export interface ProjectDeleteRequest {
  projectId: number;
  rowVersion: string;
}
