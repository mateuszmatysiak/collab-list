import type {
	CreateItemRequest,
	UpdateItemRequest,
} from "@collab-list/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export const useItems = (listId: string) => {
	return useQuery({
		queryKey: queryKeys.lists.items(listId),
		queryFn: () =>
			apiClient.get(`/api/lists/${listId}/items`).then((res) => res.data),
	});
};

export const useCreateItem = (listId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateItemRequest) =>
			apiClient
				.post(`/api/lists/${listId}/items`, data)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.lists.items(listId),
			});
		},
	});
};

export const useUpdateItem = (listId: string, itemId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateItemRequest) =>
			apiClient
				.put(`/api/lists/${listId}/items/${itemId}`, data)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.lists.items(listId),
			});
		},
	});
};

export const useDeleteItem = (listId: string, itemId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiClient
				.delete(`/api/lists/${listId}/items/${itemId}`)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.lists.items(listId),
			});
		},
	});
};
