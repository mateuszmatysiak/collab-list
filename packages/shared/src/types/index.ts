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
	isCompleted: boolean;
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

// API response types (extended with computed fields)
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
