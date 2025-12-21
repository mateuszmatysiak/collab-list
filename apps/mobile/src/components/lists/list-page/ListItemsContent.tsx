import type { ListItem } from "@collab-list/shared/types";
import { useCallback, useMemo } from "react";
import { RefreshControl, View } from "react-native";
import DragList, { type DragListRenderItemInfo } from "react-native-draglist";
import { useReorderItems } from "@/api/items.api";
import { Text } from "@/components/ui/Text";
import { AddItemDialog } from "./AddItemDialog";
import type { ItemFilter } from "./ItemFilters";
import { ListItemCard } from "./ListItemCard";

const ITEM_SEPARATOR_HEIGHT = 12;

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
	items: ListItem[];
	filter?: ItemFilter;
	categoryId?: string | null;
	isRefetching: boolean;
	onRefresh: () => void;
}

export function ListItemsContent(props: ListItemsContentProps) {
	const {
		listId,
		items,
		filter = "all",
		categoryId = null,
		isRefetching,
		onRefresh,
	} = props;

	const { mutate: reorderItems } = useReorderItems(listId);

	const filteredItems = useMemo(() => {
		let filtered = items;

		switch (filter) {
			case "all":
				filtered = items;
				break;
			case "completed":
				filtered = items.filter((item) => item.isCompleted);
				break;
			case "incomplete":
				filtered = items.filter((item) => !item.isCompleted);
				break;
			default:
				filtered = items;
		}

		if (categoryId !== null && categoryId !== undefined) {
			filtered = filtered.filter((item) => item.categoryId === categoryId);
		}

		return filtered;
	}, [items, filter, categoryId]);

	const handleReordered = useCallback(
		(fromIndex: number, toIndex: number) => {
			const movedItem = filteredItems[fromIndex];
			const targetItem = filteredItems[toIndex];
			if (!movedItem || !targetItem) return;

			const fullFromIndex = items.findIndex((item) => item.id === movedItem.id);
			const fullToIndex = items.findIndex((item) => item.id === targetItem.id);
			if (fullFromIndex === -1 || fullToIndex === -1) return;

			const newOrder = [...items];
			const [removed] = newOrder.splice(fullFromIndex, 1);
			if (!removed) return;
			newOrder.splice(fullToIndex, 0, removed);

			const itemIds = newOrder.map((item) => item.id);
			reorderItems({ itemIds });
		},
		[items, filteredItems, reorderItems],
	);

	const renderItem = useCallback(
		(info: DragListRenderItemInfo<ListItem>) => {
			const { item, onDragStart, onDragEnd, isActive } = info;

			return (
				<View style={{ marginBottom: ITEM_SEPARATOR_HEIGHT }}>
					<ListItemCard
						item={item}
						listId={listId}
						isActive={isActive}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
					/>
				</View>
			);
		},
		[listId],
	);

	if (filteredItems.length === 0) {
		return (
			<View className="flex-1 px-4">
				<EmptyList />
				<View className="py-4">
					<AddItemDialog listId={listId} />
				</View>
			</View>
		);
	}

	return (
		<DragList
			data={filteredItems}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
			onReordered={handleReordered}
			contentContainerStyle={{ paddingHorizontal: 16 }}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
			}
			ListFooterComponent={
				<View className="py-4">
					<AddItemDialog listId={listId} />
				</View>
			}
		/>
	);
}
