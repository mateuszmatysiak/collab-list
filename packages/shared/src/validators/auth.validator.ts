import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(1).max(255),
	email: z.email().max(255),
	password: z.string().min(6).max(255),
});

export const loginSchema = z.object({
	email: z.email().max(255),
	password: z.string().min(1).max(255),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.uuid(),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;
