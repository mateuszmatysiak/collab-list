import { and, eq, gt } from "drizzle-orm";
import { db } from "../db/index";
import { refreshTokens } from "../db/schema";
import { UnauthorizedError } from "../utils/errors";
import {
	generateAuthTokens,
	generateRefreshToken,
	getRefreshTokenExpiryDate,
} from "../utils/jwt";

export async function createRefreshToken(userId: string): Promise<string> {
	const token = generateRefreshToken();
	const expiresAt = getRefreshTokenExpiryDate();

	await db.insert(refreshTokens).values({
		token,
		userId,
		expiresAt,
	});

	return token;
}

async function verifyRefreshToken(token: string): Promise<string> {
	const [refreshToken] = await db
		.select()
		.from(refreshTokens)
		.where(
			and(
				eq(refreshTokens.token, token),
				gt(refreshTokens.expiresAt, new Date()),
			),
		)
		.limit(1);

	if (!refreshToken) {
		throw new UnauthorizedError("Nieprawidłowy lub wygasły refresh token");
	}

	return refreshToken.userId;
}

export async function refreshAccessToken(
	oldRefreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
	const userId = await verifyRefreshToken(oldRefreshToken);

	await db
		.delete(refreshTokens)
		.where(eq(refreshTokens.token, oldRefreshToken));

	const tokens = generateAuthTokens(userId);

	await db.insert(refreshTokens).values({
		token: tokens.refreshToken,
		userId,
		expiresAt: getRefreshTokenExpiryDate(),
	});

	return tokens;
}

export async function revokeRefreshToken(token: string): Promise<void> {
	await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}
