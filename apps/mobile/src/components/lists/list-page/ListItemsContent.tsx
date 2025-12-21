import type { ListItem } from "@collab-list/shared/types";
import { useCallback, useMemo } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	View,
} from "react-native";
import { useItems } from "@/api/items.api";
import { Text } from "@/components/ui/Text";
import { AddItemDialog } from "./AddItemDialog";
import type { ItemFilter } from "./ItemFilters";
import { ListItemCard } from "./ListItemCard";

const styles = StyleSheet.create({
	listContent: {
		paddingHorizontal: 16,
	},
});

const ITEM_SEPARATOR_HEIGHT = 12;

function SeparatorItem() {
	return <View style={{ height: ITEM_SEPARATOR_HEIGHT }} />;
}

interface ListItemRenderProps {
	item: ListItem;
	listId: string;
}

function ListItemCardRender(props: ListItemRenderProps) {
	const { item, listId } = props;

	return <ListItemCard item={item} listId={listId} />;
}

function EmptyList() {
	return (
		<View className="flex-1 items-center justify-center gap-4 py-12">
			<Text className="text-lg font-medium text-muted-foreground">
				Brak elementów
			</Text>
			<Text className="text-sm text-muted-foreground">
				Dodaj pierwszy element, klikając przycisk poniżej
			</Text>
		</View>
	);
}

interface ListItemsContentProps {
	listId: string;
	filter?: ItemFilter;
}

export function ListItemsContent(props: ListItemsContentProps) {
	const { listId, filter = "all" } = props;

	const {
		data: items,
		isLoading,
		isError,
		isRefetching,
		refetch,
	} = useItems(listId);

	const filteredItems = useMemo(() => {
		if (!items) return [];

		switch (filter) {
			case "all":
				return items;
			case "completed":
				return items.filter((item) => item.isCompleted);
			case "incomplete":
				return items.filter((item) => !item.isCompleted);
			default:
				return items;
		}
	}, [items, filter]);

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
					Błąd ładowania elementów
				</Text>
				<Pressable onPress={handleRefresh}>
					<Text className="text-primary underline">Spróbuj ponownie</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<FlatList
			data={filteredItems}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<ListItemCardRender item={item} listId={listId} />
			)}
			ListEmptyComponent={EmptyList}
			ItemSeparatorComponent={SeparatorItem}
			ListFooterComponent={
				<View className="py-4">
					<AddItemDialog listId={listId} />
				</View>
			}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={false}
			removeClippedSubviews={false}
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
			}
		/>
	);
}
