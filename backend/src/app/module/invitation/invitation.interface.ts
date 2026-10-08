import { InvitationStatus, OrganizationRole } from "../../../../generated/prisma/enums";
import { InvitationWhereInput } from "../../../../generated/prisma/models";

export interface ISentInvitationPayload {
  email: string;
  organizationRole: OrganizationRole;
}

export interface IGetAllInvitationsPayload {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
  email?: string;
  organizationRole?: OrganizationRole;
  status?:InvitationStatus;
  acceptedAt?: Date;
  expiresAt?: Date;
}