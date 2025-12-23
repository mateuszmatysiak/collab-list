export interface List {
	id: string;
	name: string;
	authorId: string;
	createdAt: Date;
}

export type ListRole = "owner" | "editor";

export interface ListWithDetails {
	id: string;
	name: string;
	authorId: string;
	createdAt: Date;
	itemsCount: number;
	completedCount: number;
	sharesCount: number;
	shares: ListShareUser[];
	role: ListRole;
}

export interface ListShareUser {
	userId: string;
	userName: string;
}
