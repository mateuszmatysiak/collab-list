import type { ListWithDetails } from "@collab-list/shared/types";
import type {
	CreateListRequest,
	UpdateListRequest,
} from "@collab-list/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export const useLists = () => {
	return useQuery<ListWithDetails[]>({
		queryKey: queryKeys.lists.all,
		queryFn: () =>
			apiClient
				.get<{ lists: ListWithDetails[] }>("/api/lists")
				.then((res) => res.data.lists),
	});
};

export const useList = (id: string | undefined) => {
	return useQuery<ListWithDetails>({
		queryKey: queryKeys.lists.detail(id ?? ""),
		queryFn: () =>
			apiClient
				.get<{ list: ListWithDetails }>(`/api/lists/${id}`)
				.then((res) => res.data.list),
		enabled: !!id,
	});
};

export const useCreateList = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateListRequest) =>
			apiClient
				.post<{ list: ListWithDetails }>("/api/lists", data)
				.then((res) => res.data),
		onSuccess: (data) => {
			const newList: ListWithDetails = {
				...data.list,
				itemsCount: 0,
				completedCount: 0,
				sharesCount: 0,
				shares: [],
				role: "owner",
			};
			queryClient.setQueryData<ListWithDetails[]>(queryKeys.lists.all, (old) =>
				old ? [...old, newList] : [newList],
			);
		},
	});
};

export const useUpdateList = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateListRequest) =>
			apiClient.patch(`/api/lists/${id}`, data).then((res) => res.data),
		onSuccess: (_data, variables) => {
			queryClient.setQueryData<ListWithDetails[]>(queryKeys.lists.all, (old) =>
				old?.map((list) => (list.id === id ? { ...list, ...variables } : list)),
			);
			queryClient.setQueryData<ListWithDetails>(
				queryKeys.lists.detail(id),
				(old) => (old ? { ...old, ...variables } : old),
			);
		},
	});
};

export const useDeleteList = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiClient.delete(`/api/lists/${id}`).then((res) => res.data),
		onSuccess: () => {
			queryClient.setQueryData<ListWithDetails[]>(queryKeys.lists.all, (old) =>
				old?.filter((list) => list.id !== id),
			);
			queryClient.removeQueries({ queryKey: queryKeys.lists.detail(id) });
		},
	});
};
