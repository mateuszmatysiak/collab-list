import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { PulsingAppIcon } from "./PulsingAppIcon";

export function AppLoadingScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-background px-6">
			<View className="mb-6">
				<PulsingAppIcon />
			</View>
			<ActivityIndicator size="large" className="mb-4" />
			<Text variant="h3" className="mb-2 text-center">
				Ładowanie aplikacji
			</Text>
		</View>
	);
}
