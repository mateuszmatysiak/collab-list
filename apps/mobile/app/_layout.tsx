import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { EnvGuard } from "@/components/guards/EnvGuard";
import { ErrorFallback } from "@/components/guards/ErrorFallback";
import { AuthProvider } from "@/contexts/auth.context";
import { ThemeProvider } from "@/contexts/theme.context";
import { QUERY_RETRY_COUNT, QUERY_STALE_TIME_MS } from "@/lib/constants";
import "../global.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: QUERY_RETRY_COUNT,
			staleTime: QUERY_STALE_TIME_MS,
		},
	},
});

export default function RootLayout() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<EnvGuard>
				<SafeAreaProvider>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider>
							<AuthProvider>
								<Slot />
								<PortalHost />
							</AuthProvider>
						</ThemeProvider>
					</QueryClientProvider>
				</SafeAreaProvider>
			</EnvGuard>
		</ErrorBoundary>
	);
}
