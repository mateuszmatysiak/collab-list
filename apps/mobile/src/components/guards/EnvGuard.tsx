import type { PropsWithChildren } from "react";
import { getEnv } from "@/config/env";

type EnvGuardProps = PropsWithChildren;

/**
 * We check the env during rendering - any error will be caught by the ErrorBoundary
 * If the env is invalid, getEnv() will throw an error which will be caught by the ErrorBoundary
 */
export function EnvGuard(props: EnvGuardProps) {
	const { children } = props;

	getEnv();

	return <>{children}</>;
}
