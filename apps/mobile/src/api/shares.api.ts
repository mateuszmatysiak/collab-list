import type { ShareListRequest } from "@ls/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export const useShares = (listId: string) => {
	return useQuery({
		queryKey: queryKeys.lists.shares(listId),
		queryFn: () =>
			apiClient.get(`/api/lists/${listId}/shares`).then((res) => res.data),
	});
};

export const useShareList = (listId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ShareListRequest) =>
			apiClient
				.post(`/api/lists/${listId}/shares`, data)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.lists.shares(listId),
			});
		},
	});
};

export const useRemoveShare = (listId: string, userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiClient
				.delete(`/api/lists/${listId}/shares/${userId}`)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.lists.shares(listId),
			});
		},
	});
};
