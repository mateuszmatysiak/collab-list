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
	userEmail: string;
	role: ListRole;
	createdAt: Date;
}

export interface SharesAuthor {
	id: string;
	name: string;
	email: string;
}

export interface SharesResponse {
	shares: ShareWithUser[];
	author: SharesAuthor;
}
