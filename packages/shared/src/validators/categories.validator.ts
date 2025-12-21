import { z } from "zod";

export const createCategorySchema = z.object({
	name: z.string().min(1).max(255),
	icon: z.string().min(1).max(100),
});

export const updateCategorySchema = z.object({
	name: z.string().min(1).max(255),
	icon: z.string().min(1).max(100),
});

export const createCategoryItemSchema = z.object({
	name: z.string().min(1).max(500),
});

export const updateCategoryItemSchema = z.object({
	name: z.string().min(1).max(500),
});

export const searchCategoryItemsSchema = z.object({
	q: z.string().min(1).max(100),
});

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
export type CreateCategoryItemRequest = z.infer<
	typeof createCategoryItemSchema
>;
export type UpdateCategoryItemRequest = z.infer<
	typeof updateCategoryItemSchema
>;
export type SearchCategoryItemsRequest = z.infer<
	typeof searchCategoryItemsSchema
>;
