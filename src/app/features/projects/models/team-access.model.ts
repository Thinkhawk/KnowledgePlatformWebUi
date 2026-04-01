export interface TeamMember {
  accessId: number;
  teamId: number;
  userId: string;
  userName?: string;
  email?: string;
  accessLevel: 0 | 1;
  createdAtUtc: string;
  updatedAtUtc?: string;
  rowVersion: string;
}

export interface TeamAccessCreateRequest {
  teamId: number;
  userId: string;
  accessLevel: 0 | 1;
}

export interface TeamAccessDeleteRequest {
  accessId: number;
  rowVersion: string;
}

export interface UserSearchResult {
  userId: string;
  fullName: string;
  email: string;
}
