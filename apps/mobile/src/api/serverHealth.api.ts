import { useQuery } from "@tanstack/react-query";
import { QUERY_STALE_TIME_MS } from "@/lib/constants";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

interface HealthResponse {
	status: string;
	timestamp: string;
}

const HEALTH_CHECK_INTERVAL_MS = 2000;
const MAX_RETRIES = 60;
const CACHE_TIME_MS = 10 * 60 * 1000;

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
		staleTime: QUERY_STALE_TIME_MS,
		gcTime: CACHE_TIME_MS,
	});
}
