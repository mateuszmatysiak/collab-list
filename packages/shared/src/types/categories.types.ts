export const CategoryType = {
	USER: "user",
	LOCAL: "local",
} as const;
export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

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
}

export interface Category {
	id: string;
	name: string;
	icon: string;
	createdAt: Date;
}
