import { z } from "zod";

export const mobileEnvSchema = z.object({
	EXPO_PUBLIC_API_URL: z.url(),
});

export type MobileEnv = z.infer<typeof mobileEnvSchema>;
