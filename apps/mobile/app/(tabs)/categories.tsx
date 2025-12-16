import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";

export default function CategoriesScreen() {
	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-1 items-center justify-center px-6">
				<Text className="text-xl font-semibold text-muted-foreground">
					Kategorie
				</Text>
			</View>
		</SafeAreaView>
	);
}
