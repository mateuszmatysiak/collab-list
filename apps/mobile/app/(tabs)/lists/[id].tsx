import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useItems } from "@/api/items.api";
import { useList } from "@/api/lists.api";
import { CategoryFilters } from "@/components/lists/list-page/CategoryFilters";
import {
	type ItemFilter,
	ItemFilters,
} from "@/components/lists/list-page/ItemFilters";
import { ListHeader } from "@/components/lists/list-page/ListHeader";
import {
	ListItemsContent,
	type ListItemsContentRef,
} from "@/components/lists/list-page/ListItemsContent";
import { Text } from "@/components/ui/Text";

interface ListDetailContentProps {
	id: string;
}

function ListDetailContent(props: ListDetailContentProps) {
	const { id } = props;

	const listItemsContentRef = useRef<ListItemsContentRef>(null);

	const {
		data: list,
		isLoading: isListLoading,
		isError: isListError,
		refetch: refetchList,
	} = useList(id);
	const {
		data: items,
		isLoading: isItemsLoading,
		isError: isItemsError,
		isRefetching,
		refetch: refetchItems,
	} = useItems(id);

	const [filter, setFilter] = useState<ItemFilter>("all");
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);

	useFocusEffect(
		useCallback(() => {
			const timeout = setTimeout(() => {
				listItemsContentRef.current?.focusAddItem();
			}, 300);
			return () => clearTimeout(timeout);
		}, []),
	);

	const handleFilterChange = useCallback((newFilter: ItemFilter) => {
		setFilter(newFilter);
	}, []);

	const handleCategoryChange = useCallback((categoryId: string | null) => {
		setSelectedCategoryId(categoryId);
	}, []);

	const handleRefresh = useCallback(() => {
		refetchItems();
		refetchList();
	}, [refetchItems, refetchList]);

	const isLoading = isListLoading || isItemsLoading;
	const isError = isListError || isItemsError;

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (!list) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-lg font-medium text-destructive">
					Lista nie znaleziona
				</Text>
			</View>
		);
	}

	if (!items) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-lg font-medium text-destructive">
					Lista nie ma elementów
				</Text>
			</View>
		);
	}

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center gap-2 px-6">
				<Text className="text-lg font-medium text-destructive">
					Błąd ładowania listy
				</Text>
				<Pressable onPress={handleRefresh}>
					<Text className="text-primary underline">Spróbuj ponownie</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<>
			<ListHeader list={list} />

			<ItemFilters filter={filter} onFilterChange={handleFilterChange} />

			<CategoryFilters
				listId={id}
				selectedCategoryId={selectedCategoryId}
				onCategoryChange={handleCategoryChange}
			/>

			<ListItemsContent
				ref={listItemsContentRef}
				listId={id}
				items={items}
				filter={filter}
				categoryId={selectedCategoryId}
				isRefetching={isRefetching}
				onRefresh={handleRefresh}
			/>
		</>
	);
}

export default function ListDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

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

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<ListDetailContent key={id} id={id} />
		</SafeAreaView>
	);
}
