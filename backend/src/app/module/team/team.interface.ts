import { TeamWhereInput } from "../../../../generated/prisma/models";

export interface ICreateTeamPayload {
  name: string;
  description?: string;
}

export interface IUpdateTeamPayload {
  name?: string;
  description?: string;
}

export interface IGetAllTeamsPayload extends TeamWhereInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  name?: string;
  description?: string;
  organizationId?: string; // Optional organization ID for filtering
}

export interface IAssignTeamLeadPayload {
  userId: string;
}

export interface IAddTeamMemberPayload {
  userId: string;
}


export interface IGetAllTeamMembersPayload  {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  userId?: string; // Optional user ID for filtering
} 