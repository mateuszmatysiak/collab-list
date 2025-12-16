import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoutDialog } from "@/components/auth/LogoutDialog";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { ListsContent } from "@/components/lists/ListsContent";
import { Text } from "@/components/ui/Text";

export default function ListsScreen() {
	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-1">
				<View className="flex-row items-center justify-between px-6 py-4">
					<Text className="text-2xl font-bold">Moje listy</Text>
					<View className="flex-row items-center gap-2">
						<LogoutDialog />
						<CreateListDialog />
					</View>
				</View>

				<ListsContent />
			</View>
		</SafeAreaView>
	);
}
