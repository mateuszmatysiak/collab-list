import { z } from "zod";

export const createCategorySchema = z.object({
	name: z.string().min(1).max(255),
	icon: z.string().min(1).max(100),
});

export const updateCategorySchema = z.object({
	name: z.string().min(1).max(255).optional(),
	icon: z.string().min(1).max(100).optional(),
});

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
