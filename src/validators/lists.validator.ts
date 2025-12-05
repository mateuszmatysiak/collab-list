import { z } from "zod";

export const createListSchema = z.object({
	name: z.string().min(1).max(500),
});

export const updateListSchema = z.object({
	name: z.string().min(1).max(500),
});
