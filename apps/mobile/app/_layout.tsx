import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/auth.context";
import { ThemeProvider } from "@/contexts/theme.context";
import { QUERY_STALE_TIME_MS } from "@/lib/constants";
import "../global.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			staleTime: QUERY_STALE_TIME_MS,
		},
	},
});

export default function RootLayout() {
	return (
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
	);
}
