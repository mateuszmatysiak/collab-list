import { randomUUID } from "node:crypto";
import type { AuthTokens, JWTPayload } from "@collab-list/shared/types";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN_MS = 30 * 24 * 60 * 60 * 1000;

export function generateAccessToken(userId: string): string {
	const payload: JWTPayload = { userId };

	return jwt.sign(payload, getEnv().JWT_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRES_IN,
	});
}

export function generateRefreshToken(): string {
	return randomUUID();
}

export function getRefreshTokenExpiryDate(): Date {
	return new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS);
}

export function verifyAccessToken(token: string): JWTPayload {
	return jwt.verify(token, getEnv().JWT_SECRET) as JWTPayload;
}

export function generateAuthTokens(userId: string): AuthTokens {
	const accessToken = generateAccessToken(userId);
	const refreshToken = generateRefreshToken();

	return {
		accessToken,
		refreshToken,
	};
}
