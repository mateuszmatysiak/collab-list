export interface User {
	id: string;
	name: string;
	login: string;
	passwordHash: string;
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
