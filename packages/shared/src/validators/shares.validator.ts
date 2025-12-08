import { z } from "zod";

export const shareListSchema = z.object({
	email: z.email().max(255),
});

export type ShareListRequest = z.infer<typeof shareListSchema>;
