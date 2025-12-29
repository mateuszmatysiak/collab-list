import type { PropsWithChildren } from "react";
import { ActivityIndicator, View } from "react-native";
import { useServerHealth } from "@/api/serverHealth.api";
import { ServerWakeUpScreen } from "@/components/guards/ServerWakeUpScreen";

type ServerHealthGuardProps = PropsWithChildren;

export function ServerHealthGuard(props: ServerHealthGuardProps) {
	const { children } = props;

	const { isPending, isError, refetch, failureCount } = useServerHealth();

	const isWakingUp = isPending && failureCount > 0;

	if (isError) {
		return <ServerWakeUpScreen error onRetry={refetch} />;
	}

	if (isWakingUp) {
		return <ServerWakeUpScreen />;
	}

	if (isPending) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return children;
}
