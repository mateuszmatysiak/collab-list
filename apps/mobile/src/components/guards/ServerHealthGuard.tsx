import type { PropsWithChildren } from "react";
import { useServerHealth } from "@/api/serverHealth.api";
import { AppLoadingScreen } from "@/components/guards/AppLoadingScreen";
import { ServerWakeUpScreen } from "@/components/guards/ServerWakeUpScreen";

type ServerHealthGuardProps = PropsWithChildren;

export function ServerHealthGuard(props: ServerHealthGuardProps) {
	const { children } = props;

	const { isPending, isError, refetch, failureCount } = useServerHealth();

	const isServerWakingUp = isPending && failureCount > 0;

	if (isError) {
		return <ServerWakeUpScreen error onRetry={refetch} />;
	}

	if (isServerWakingUp) {
		return <ServerWakeUpScreen />;
	}

	if (isPending) {
		return <AppLoadingScreen />;
	}

	return children;
}
