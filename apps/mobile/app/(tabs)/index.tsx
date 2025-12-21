import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoutDialog } from "@/components/auth/LogoutDialog";
import { ListFilters } from "@/components/lists/lists-page/ListFilters";
import {
	type ListFilter,
	ListsContent,
} from "@/components/lists/lists-page/ListsContent";
import { Text } from "@/components/ui/Text";

export default function ListsScreen() {
	const [filter, setFilter] = useState<ListFilter>("all");

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-1">
				<View className="flex-row items-center justify-between px-6 py-4">
					<Text className="text-2xl font-bold">Moje listy</Text>
					<View className="ml-auto">
						<LogoutDialog />
					</View>
				</View>

				<ListFilters filter={filter} onFilterChange={setFilter} />

				<ListsContent filter={filter} />
			</View>
		</SafeAreaView>
	);
}
