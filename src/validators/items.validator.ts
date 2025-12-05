import { z } from "zod";

export const createItemSchema = z.object({
	title: z.string().min(1).max(1000),
});

export const updateItemSchema = z.object({
	title: z.string().min(1).max(1000).optional(),
	is_completed: z.boolean().optional(),
});
