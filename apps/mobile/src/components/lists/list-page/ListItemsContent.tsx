import type { ListItem } from "@collab-list/shared/types";
import { useCallback, useMemo, useRef } from "react";
import { RefreshControl, View } from "react-native";
import DragList, { type DragListRenderItemInfo } from "react-native-draglist";
import { useReorderItems } from "@/api/items.api";
import { UNCATEGORIZED_FILTER } from "@/lib/constants";
import { AddItemCard } from "./AddItemCard";
import type { ItemFilter } from "./ItemFilters";
import { ListItemCard } from "./ListItemCard";

const ITEM_SEPARATOR_HEIGHT = 12;

function filterByStatus(items: ListItem[], filter: ItemFilter): ListItem[] {
	switch (filter) {
		case "completed":
			return items.filter((item) => item.isCompleted);
		case "incomplete":
			return items.filter((item) => !item.isCompleted);
		default:
			return items;
	}
}

function filterByCategory(
	items: ListItem[],
	categoryId: string | null,
): ListItem[] {
	if (categoryId === null) return items;
	if (categoryId === UNCATEGORIZED_FILTER) {
		return items.filter((item) => item.categoryId === null);
	}
	return items.filter((item) => item.categoryId === categoryId);
}

function sortByCompletionStatus(items: ListItem[]): ListItem[] {
	return [...items].sort((a, b) => {
		if (a.isCompleted === b.isCompleted) {
			return a.position - b.position;
		}
		return a.isCompleted ? 1 : -1;
	});
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
	const newItemIdsRef = useRef<Set<string>>(new Set());

	const handleItemCreated = useCallback((itemId: string) => {
		newItemIdsRef.current.add(itemId);
	}, []);

	const filteredItems = useMemo(() => {
		const byStatus = filterByStatus(items, filter);
		return filterByCategory(byStatus, categoryId);
	}, [items, filter, categoryId]);

	const sortedItems = useMemo(
		() => sortByCompletionStatus(filteredItems),
		[filteredItems],
	);

	const handleReordered = useCallback(
		(fromIndex: number, toIndex: number) => {
			const movedItem = sortedItems[fromIndex];
			const targetItem = sortedItems[toIndex];
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
		[items, sortedItems, reorderItems],
	);

	const renderItem = useCallback(
		(info: DragListRenderItemInfo<ListItem>) => {
			const { item, onDragStart, onDragEnd, isActive } = info;
			const isNewItem = newItemIdsRef.current.has(item.id);

			if (isNewItem) {
				newItemIdsRef.current.delete(item.id);
			}

			return (
				<View style={{ marginBottom: ITEM_SEPARATOR_HEIGHT }}>
					<ListItemCard
						item={item}
						listId={listId}
						isActive={isActive}
						isNewItem={isNewItem}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
					/>
				</View>
			);
		},
		[listId],
	);

	return (
		<DragList
			data={sortedItems}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
			onReordered={handleReordered}
			contentContainerStyle={{ paddingHorizontal: 16 }}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
			}
			ListFooterComponent={
				<AddItemCard listId={listId} onItemCreated={handleItemCreated} />
			}
		/>
	);
}
