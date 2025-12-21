import type {
	Category,
	CategoryItem,
	CategoryItemWithCategory,
	CategoryWithItems,
} from "@collab-list/shared/types";
import type {
	CreateCategoryItemRequest,
	CreateCategoryRequest,
	UpdateCategoryItemRequest,
	UpdateCategoryRequest,
} from "@collab-list/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

interface CategoryWithCount extends Category {
	itemsCount: number;
}

export const useCategories = () => {
	return useQuery<CategoryWithCount[]>({
		queryKey: queryKeys.categories.all,
		queryFn: () =>
			apiClient
				.get<{ categories: CategoryWithCount[] }>("/api/categories")
				.then((res) => res.data.categories),
	});
};

export const useCategory = (id: string | undefined) => {
	return useQuery<CategoryWithItems>({
		queryKey: queryKeys.categories.detail(id ?? ""),
		queryFn: () =>
			apiClient
				.get<{ category: CategoryWithItems }>(`/api/categories/${id}`)
				.then((res) => res.data.category),
		enabled: !!id,
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCategoryRequest) =>
			apiClient
				.post<{ category: Category }>("/api/categories", data)
				.then((res) => res.data),
		onSuccess: (data) => {
			const newCategory: CategoryWithCount = {
				...data.category,
				itemsCount: 0,
			};
			queryClient.setQueryData<CategoryWithCount[]>(
				queryKeys.categories.all,
				(old) => (old ? [...old, newCategory] : [newCategory]),
			);
		},
	});
};

export const useUpdateCategory = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateCategoryRequest) =>
			apiClient.patch(`/api/categories/${id}`, data).then((res) => res.data),
		onSuccess: (_data, variables) => {
			queryClient.setQueryData<CategoryWithCount[]>(
				queryKeys.categories.all,
				(old) =>
					old?.map((cat) => (cat.id === id ? { ...cat, ...variables } : cat)),
			);
			queryClient.setQueryData<CategoryWithItems>(
				queryKeys.categories.detail(id),
				(old) => (old ? { ...old, ...variables } : old),
			);
		},
	});
};

export const useDeleteCategory = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiClient.delete(`/api/categories/${id}`).then((res) => res.data),
		onSuccess: () => {
			queryClient.setQueryData<CategoryWithCount[]>(
				queryKeys.categories.all,
				(old) => old?.filter((cat) => cat.id !== id),
			);
			queryClient.removeQueries({ queryKey: queryKeys.categories.detail(id) });
		},
	});
};

export const useCategoryItems = (categoryId: string | undefined) => {
	return useQuery<CategoryItem[]>({
		queryKey: queryKeys.categories.items(categoryId ?? ""),
		queryFn: () =>
			apiClient
				.get<{ items: CategoryItem[] }>(`/api/categories/${categoryId}/items`)
				.then((res) => res.data.items),
		enabled: !!categoryId,
	});
};

export const useCreateCategoryItem = (categoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCategoryItemRequest) =>
			apiClient
				.post<{ item: CategoryItem }>(
					`/api/categories/${categoryId}/items`,
					data,
				)
				.then((res) => res.data),
		onSuccess: (data) => {
			queryClient.setQueryData<CategoryWithItems>(
				queryKeys.categories.detail(categoryId),
				(old) =>
					old
						? {
								...old,
								items: [...old.items, data.item],
								itemsCount: old.itemsCount + 1,
							}
						: old,
			);
			queryClient.setQueryData<CategoryWithCount[]>(
				queryKeys.categories.all,
				(old) =>
					old?.map((cat) =>
						cat.id === categoryId
							? { ...cat, itemsCount: cat.itemsCount + 1 }
							: cat,
					),
			);
		},
	});
};

export const useUpdateCategoryItem = (categoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			itemId,
			data,
		}: {
			itemId: string;
			data: UpdateCategoryItemRequest;
		}) =>
			apiClient
				.patch(`/api/categories/${categoryId}/items/${itemId}`, data)
				.then((res) => res.data),
		onSuccess: (_data, variables) => {
			queryClient.setQueryData<CategoryWithItems>(
				queryKeys.categories.detail(categoryId),
				(old) =>
					old
						? {
								...old,
								items: old.items.map((item) =>
									item.id === variables.itemId
										? { ...item, ...variables.data }
										: item,
								),
							}
						: old,
			);
		},
	});
};

export const useDeleteCategoryItem = (categoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (itemId: string) =>
			apiClient
				.delete(`/api/categories/${categoryId}/items/${itemId}`)
				.then((res) => res.data),
		onSuccess: (_data, itemId) => {
			queryClient.setQueryData<CategoryWithItems>(
				queryKeys.categories.detail(categoryId),
				(old) =>
					old
						? {
								...old,
								items: old.items.filter((item) => item.id !== itemId),
								itemsCount: old.itemsCount - 1,
							}
						: old,
			);
			queryClient.setQueryData<CategoryWithCount[]>(
				queryKeys.categories.all,
				(old) =>
					old?.map((cat) =>
						cat.id === categoryId
							? { ...cat, itemsCount: cat.itemsCount - 1 }
							: cat,
					),
			);
		},
	});
};

export const useSearchCategoryItems = (query: string) => {
	return useQuery<CategoryItemWithCategory[]>({
		queryKey: queryKeys.categories.search(query),
		queryFn: () =>
			apiClient
				.get<{ items: CategoryItemWithCategory[] }>(
					`/api/categories/items/search?q=${encodeURIComponent(query)}`,
				)
				.then((res) => res.data.items),
		enabled: query.length >= 1,
	});
};
