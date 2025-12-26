import { z } from "zod";

const categoryTypeSchema = z.enum(["user", "local"]);

export const createItemSchema = z
	.object({
		title: z.string().max(1000),
		description: z.string().max(2000).optional(),
		categoryId: z.uuid().nullable().optional(),
		categoryType: categoryTypeSchema.nullable().optional(),
	})
	.refine(
		(data) => {
			const hasCategoryId =
				data.categoryId !== null && data.categoryId !== undefined;
			const hasCategoryType =
				data.categoryType !== null && data.categoryType !== undefined;
			return hasCategoryId === hasCategoryType;
		},
		{ message: "categoryId i categoryType muszą być ustawione razem" },
	);

export const updateItemSchema = z
	.object({
		title: z.string().min(1).max(1000).optional(),
		description: z.string().max(2000).optional(),
		is_completed: z.boolean().optional(),
		categoryId: z.uuid().nullable().optional(),
		categoryType: categoryTypeSchema.nullable().optional(),
	})
	.refine(
		(data) => {
			if (data.categoryId === null) {
				return true;
			}
			if (data.categoryId !== undefined) {
				return data.categoryType !== undefined && data.categoryType !== null;
			}
			return true;
		},
		{ message: "categoryId wymaga categoryType" },
	);

export const reorderItemsSchema = z.object({
	itemIds: z.array(z.uuid()).min(1),
});

export type CreateItemRequest = z.infer<typeof createItemSchema>;
export type UpdateItemRequest = z.infer<typeof updateItemSchema>;
export type ReorderItemsRequest = z.infer<typeof reorderItemsSchema>;
