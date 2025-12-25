import type { Category, ListCategory } from "@collab-list/shared/types";
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "@collab-list/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export const useUserCategories = () => {
	return useQuery<Category[]>({
		queryKey: queryKeys.categories.user,
		queryFn: () =>
			apiClient
				.get<{ categories: Category[] }>("/api/categories/user")
				.then((res) => res.data.categories),
	});
};

export const useCreateUserCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCategoryRequest) =>
			apiClient
				.post<{ category: Category }>("/api/categories/user", data)
				.then((res) => res.data),
		onSuccess: (data) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.user, (old) =>
				old ? [...old, data.category] : [data.category],
			);
		},
	});
};

export const useUpdateUserCategory = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateCategoryRequest) =>
			apiClient.patch(`/api/categories/${id}`, data).then((res) => res.data),
		onSuccess: (_data, variables) => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.user, (old) =>
				old?.map((cat) => (cat.id === id ? { ...cat, ...variables } : cat)),
			);
			queryClient.invalidateQueries({ queryKey: ["lists"] });
			queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
		},
	});
};

export const useDeleteUserCategory = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiClient.delete(`/api/categories/${id}`).then((res) => res.data),
		onSuccess: () => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.user, (old) =>
				old?.filter((cat) => cat.id !== id),
			);
			queryClient.invalidateQueries({ queryKey: ["lists"] });
			queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
		},
	});
};

export const useListCategories = (listId: string) => {
	return useQuery<ListCategory[]>({
		queryKey: queryKeys.categories.list(listId),
		queryFn: () =>
			apiClient
				.get<{ categories: ListCategory[] }>(`/api/lists/${listId}/categories`)
				.then((res) => res.data.categories),
		enabled: !!listId,
	});
};

export const useCreateLocalCategory = (listId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCategoryRequest) =>
			apiClient
				.post<{ category: ListCategory }>(
					`/api/lists/${listId}/categories/local`,
					data,
				)
				.then((res) => res.data),
		onSuccess: (data) => {
			queryClient.setQueryData<ListCategory[]>(
				queryKeys.categories.list(listId),
				(old) => (old ? [...old, data.category] : [data.category]),
			);

			if (data.category.type === "user") {
				queryClient.invalidateQueries({ queryKey: queryKeys.categories.user });
			}
		},
	});
};

export const useCategories = useUserCategories;
export const useCreateCategory = useCreateUserCategory;
export const useUpdateCategory = useUpdateUserCategory;
export const useDeleteCategory = useDeleteUserCategory;
