import type { PropsWithChildren } from "react";
import { useServerHealth } from "@/api/serverHealth.api";
import { ServerWakeUpScreen } from "@/components/guards/ServerWakeUpScreen";

type ServerHealthGuardProps = PropsWithChildren;

export function ServerHealthGuard(props: ServerHealthGuardProps) {
	const { children } = props;

	const { data, isLoading, isError, refetch } = useServerHealth();

	if (isError) {
		return <ServerWakeUpScreen error onRetry={refetch} />;
	}

	if (isLoading || !data) {
		return <ServerWakeUpScreen />;
	}

	return children;
}
