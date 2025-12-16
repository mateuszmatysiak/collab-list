import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/contexts/auth.context";

export default function ProfileScreen() {
	const { user } = useAuth();

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-1 items-center justify-center px-6">
				<Text className="text-xl font-semibold text-muted-foreground">
					Profil
				</Text>
				<Text className="mt-2 text-center text-muted-foreground">
					{user?.email}
				</Text>
			</View>
		</SafeAreaView>
	);
}
