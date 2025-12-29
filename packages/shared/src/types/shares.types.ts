import type { ListRole } from "./lists.types";

export interface ListShare {
	id: string;
	listId: string;
	userId: string;
	role: ListRole;
	createdAt: Date;
}

export interface ShareWithUser {
	id: string;
	userId: string;
	userName: string;
	userLogin: string;
	role: ListRole;
	createdAt: Date;
}

export interface SharesAuthor {
	id: string;
	name: string;
	login: string;
}

export interface SharesResponse {
	shares: ShareWithUser[];
	author: SharesAuthor;
}
