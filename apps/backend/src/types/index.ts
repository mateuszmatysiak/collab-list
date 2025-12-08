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

export interface ListShare {
	id: string;
	listId: string;
	userId: string;
	role: "owner" | "editor";
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
