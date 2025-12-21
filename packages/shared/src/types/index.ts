export interface User {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	createdAt: Date;
}

export interface List {
	id: string;
	name: string;
	authorId: string;
	createdAt: Date;
}

export interface ListItem {
	id: string;
	listId: string;
	title: string;
	description: string | null;
	isCompleted: boolean;
	categoryId: string | null;
	categoryIcon: string | null;
	position: number;
	createdAt: Date;
}

export type ListRole = "owner" | "editor";

export interface ListShare {
	id: string;
	listId: string;
	userId: string;
	role: ListRole;
	createdAt: Date;
}

export interface RefreshToken {
	id: string;
	token: string;
	userId: string;
	expiresAt: Date;
	createdAt: Date;
}

export interface JWTPayload {
	userId: string;
	iat?: number;
	exp?: number;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface ListShareUser {
	userId: string;
	userName: string;
}

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

export interface Category {
	id: string;
	name: string;
	icon: string;
	createdAt: Date;
}

export interface CategoryItem {
	id: string;
	categoryId: string;
	name: string;
	createdAt: Date;
}

export interface CategoryWithItems extends Category {
	items: CategoryItem[];
	itemsCount: number;
}

export interface CategoryItemWithCategory extends CategoryItem {
	categoryName: string;
	categoryIcon: string;
}
