import type { Category } from "@collab-list/shared/types";
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "@collab-list/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export const useCategories = () => {
	return useQuery<Category[]>({
		queryKey: queryKeys.categories.all,
		queryFn: () =>
			apiClient
				.get<{ categories: Category[] }>("/api/categories")
				.then((res) => res.data.categories),
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
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (old) =>
				old ? [...old, data.category] : [data.category],
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
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (old) =>
				old?.map((cat) => (cat.id === id ? { ...cat, ...variables } : cat)),
			);
			queryClient.invalidateQueries({ queryKey: ["lists"] });
		},
	});
};

export const useDeleteCategory = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiClient.delete(`/api/categories/${id}`).then((res) => res.data),
		onSuccess: () => {
			queryClient.setQueryData<Category[]>(queryKeys.categories.all, (old) =>
				old?.filter((cat) => cat.id !== id),
			);
			queryClient.invalidateQueries({ queryKey: ["lists"] });
		},
	});
};
