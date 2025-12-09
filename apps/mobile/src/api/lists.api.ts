import type {
	CreateListRequest,
	UpdateListRequest,
} from "@collab-list/shared/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export const useLists = () => {
	return useQuery({
		queryKey: queryKeys.lists.all,
		queryFn: () => apiClient.get("/api/lists").then((res) => res.data),
	});
};

export const useList = (id: string) => {
	return useQuery({
		queryKey: queryKeys.lists.detail(id),
		queryFn: () => apiClient.get(`/api/lists/${id}`).then((res) => res.data),
	});
};

export const useCreateList = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateListRequest) =>
			apiClient.post("/api/lists", data).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
		},
	});
};

export const useUpdateList = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateListRequest) =>
			apiClient.put(`/api/lists/${id}`, data).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(id) });
		},
	});
};

export const useDeleteList = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiClient.delete(`/api/lists/${id}`).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
		},
	});
};
