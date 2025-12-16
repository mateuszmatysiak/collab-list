import type { ListShareUser, ListWithDetails } from "@collab-list/shared/types";
import type { ShareListRequest } from "@collab-list/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

interface ShareListResponse {
	share: {
		id: string;
		listId: string;
		userId: string;
		role: string;
		createdAt: string;
		userName: string;
	};
}

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
				.post<ShareListResponse>(`/api/lists/${listId}/share`, data)
				.then((res) => res.data),
		onSuccess: (data) => {
			const newShareUser: ListShareUser = {
				userId: data.share.userId,
				userName: data.share.userName,
			};

			queryClient.setQueryData<ListWithDetails[]>(queryKeys.lists.all, (old) =>
				old?.map((list) =>
					list.id === listId
						? {
								...list,
								sharesCount: list.sharesCount + 1,
								shares: [...list.shares, newShareUser],
							}
						: list,
				),
			);

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
				.delete(`/api/lists/${listId}/share/${userId}`)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.setQueryData<ListWithDetails[]>(queryKeys.lists.all, (old) =>
				old?.map((list) =>
					list.id === listId
						? {
								...list,
								sharesCount: Math.max(0, list.sharesCount - 1),
								shares: list.shares.filter((share) => share.userId !== userId),
							}
						: list,
				),
			);

			queryClient.invalidateQueries({
				queryKey: queryKeys.lists.shares(listId),
			});
		},
	});
};
