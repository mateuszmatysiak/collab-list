import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useList } from "@/api/lists.api";
import {
	type ItemFilter,
	ItemFilters,
} from "@/components/lists/list-page/ItemFilters";
import { ListItemsContent } from "@/components/lists/list-page/ListItemsContent";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

export default function ListDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: list, isLoading, isError } = useList(id);
	const [filter, setFilter] = useState<ItemFilter>("all");

	if (!id) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-lg font-medium text-destructive">
						Nieprawidłowy identyfikator listy
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" />
				</View>
			</SafeAreaView>
		);
	}

	if (isError || !list) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center gap-2 px-6">
					<Text className="text-lg font-medium text-destructive">
						Błąd ładowania listy
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-row items-center gap-3 px-4 py-3">
				<Pressable
					onPress={() => router.back()}
					className="size-10 items-center justify-center rounded-full active:bg-accent"
					hitSlop={8}
				>
					<Icon as={ArrowLeft} className="text-foreground" size={20} />
				</Pressable>
				<Text className="flex-1 text-xl font-bold">{list.name}</Text>
			</View>

			<ItemFilters filter={filter} onFilterChange={setFilter} />

			<ListItemsContent listId={id} filter={filter} />
		</SafeAreaView>
	);
}
