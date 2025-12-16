import type { ListWithDetails } from "@collab-list/shared/types";
import { useCallback } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	View,
} from "react-native";
import { useLists } from "@/api/lists.api";
import { ListCard } from "@/components/lists/ListCard";
import { Text } from "@/components/ui/Text";

const styles = StyleSheet.create({
	listContent: {
		paddingHorizontal: 16,
	},
});

const ITEM_SEPARATOR_HEIGHT = 12;

function SeparatorItem() {
	return <View style={{ height: ITEM_SEPARATOR_HEIGHT }} />;
}

function ListCardItem(props: { item: ListWithDetails }) {
	const { item } = props;

	return <ListCard list={item} />;
}

function EmptyList() {
	return (
		<View className="flex-1 items-center justify-center gap-4 py-12">
			<Text className="text-lg font-medium text-muted-foreground">
				Brak list
			</Text>
			<Text className="text-sm text-muted-foreground">
				Utwórz pierwszą listę, klikając przycisk plusa
			</Text>
		</View>
	);
}

export function ListsContent() {
	const { data: lists, isLoading, isError, isRefetching, refetch } = useLists();

	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center gap-2 px-6">
				<Text className="text-lg font-medium text-destructive">
					Błąd ładowania
				</Text>
				<Pressable onPress={handleRefresh}>
					<Text className="text-primary underline">Spróbuj ponownie</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<FlatList
			data={lists}
			keyExtractor={(item) => item.id}
			renderItem={ListCardItem}
			ListEmptyComponent={EmptyList}
			ItemSeparatorComponent={SeparatorItem}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
			}
		/>
	);
}
