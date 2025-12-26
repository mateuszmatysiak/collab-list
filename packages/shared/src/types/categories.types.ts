export type CategoryType = "user" | "local";

export interface UserCategory {
	id: string;
	userId: string;
	name: string;
	icon: string;
	listId: string | null;
	createdAt: Date;
}

export interface ListCategory {
	id: string;
	name: string;
	icon: string;
	type: CategoryType;
	isOwner: boolean;
	hasInDictionary?: boolean;
	authorName?: string;
}

export interface Category {
	id: string;
	name: string;
	icon: string;
	createdAt: Date;
}
