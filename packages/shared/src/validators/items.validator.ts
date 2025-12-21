import { z } from "zod";

export const createItemSchema = z.object({
	title: z.string().min(1).max(1000),
	description: z.string().min(0).max(2000),
	categoryId: z.string().uuid().nullable().optional(),
});

export const updateItemSchema = z.object({
	title: z.string().min(1).max(1000).optional(),
	description: z.string().max(2000).optional(),
	is_completed: z.boolean().optional(),
	categoryId: z.string().uuid().nullable().optional(),
});

export type CreateItemRequest = z.infer<typeof createItemSchema>;
export type UpdateItemRequest = z.infer<typeof updateItemSchema>;
