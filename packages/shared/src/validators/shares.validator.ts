import { z } from "zod";

export const shareListSchema = z.object({
	login: z.string().min(1).max(255),
});

export type ShareListRequest = z.infer<typeof shareListSchema>;
