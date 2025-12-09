import { z } from "zod";

export const registerSchema = z.object({
	name: z
		.string({ message: "Imię i nazwisko jest wymagane" })
		.min(1, "Imię i nazwisko jest wymagane")
		.max(255, "Imię i nazwisko nie może przekraczać 255 znaków"),
	email: z
		.email({ message: "Podaj prawidłowy adres email" })
		.max(255, "Email nie może przekraczać 255 znaków"),
	password: z
		.string({ message: "Hasło jest wymagane" })
		.min(6, "Hasło musi mieć minimum 6 znaków")
		.max(255, "Hasło nie może przekraczać 255 znaków"),
});

export const loginSchema = z.object({
	email: z
		.email({ message: "Podaj prawidłowy adres email" })
		.max(255, "Email nie może przekraczać 255 znaków"),
	password: z
		.string({ message: "Hasło jest wymagane" })
		.min(1, "Hasło jest wymagane")
		.max(255, "Hasło nie może przekraczać 255 znaków"),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.uuid(),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;
