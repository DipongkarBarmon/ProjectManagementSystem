import { ProjectStatus } from "../../../../generated/prisma/enums"

export interface ICreateProjectPayload {
	name: string
	description?: string
	projectManagerId?: string
	slug?: string,
	startDate?: string | Date | null
	endDate?: string | Date | null
}

export interface IUpdateProjectPayload {
	name?: string
	description?: string
	status?: ProjectStatus
	startDate?: string | Date | null
	endDate?: string | Date | null
}

export interface IProjectQuery {
	 searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string,
    name? : string,
    description? : string,
    slug? : string,
		startDate? : string,
		endDate? : string,
}
