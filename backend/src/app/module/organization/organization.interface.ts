// import { OrganizationWhereInput } from "../../../../generated/prisma/models/Organization";

import { OrganizationWhereInput } from "../../../../generated/prisma/models";

export interface ICreateOrganization {
  name: string;
  slug: string;
  logo : string;
  description?: string;
}

export interface IUpdateOrganizationInfo {
  name?: string;
  slug?: string;
  description?: string;
}

export interface IOrganizationQuery extends OrganizationWhereInput  {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string,
    name? : string,
    slug? : string,
    description? : string
}
