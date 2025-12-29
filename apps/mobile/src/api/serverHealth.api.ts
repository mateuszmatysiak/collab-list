import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

interface HealthResponse {
	status: string;
	timestamp: string;
}

const HEALTH_CHECK_INTERVAL_MS = 2000;
const MAX_RETRIES = 60;

export function useServerHealth() {
	return useQuery<HealthResponse>({
		queryKey: queryKeys.server.health,
		queryFn: () =>
			apiClient.get<HealthResponse>("/health").then((res) => res.data),
		retry: MAX_RETRIES,
		retryDelay: () => {
			return HEALTH_CHECK_INTERVAL_MS;
		},
		refetchInterval: false,
		staleTime: 0,
		gcTime: 0,
	});
}
