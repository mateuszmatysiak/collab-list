import type { ListWithDetails } from "@collab-list/shared/types";
import { useCallback, useMemo } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	View,
} from "react-native";
import { useLists } from "@/api/lists.api";
import { Text } from "@/components/ui/Text";
import { CreateListButton } from "./CreateListButton";
import { ListCard } from "./ListCard";

export type ListFilter = "all" | "mine" | "shared";

interface ListsContentProps {
	filter?: ListFilter;
}

const styles = StyleSheet.create({
	listContent: {
		paddingHorizontal: 16,
	},
});

function SeparatorItem() {
	return <View className="h-3" />;
}

function ListCardRender(props: { item: ListWithDetails }) {
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
				Utwórz pierwszą listę, klikając przycisk poniżej
			</Text>
		</View>
	);
}

export function ListsContent(props: ListsContentProps) {
	const { filter = "all" } = props;

	const { data: lists, isLoading, isError, isRefetching, refetch } = useLists();

	const filteredLists = useMemo(() => {
		if (!lists) return [];

		switch (filter) {
			case "all":
				return lists;
			case "mine":
				return lists.filter((list) => list.role === "owner");
			case "shared":
				return lists.filter((list) => list.role === "editor");
			default:
				return lists;
		}
	}, [lists, filter]);

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
			data={filteredLists}
			keyExtractor={(item) => item.id}
			renderItem={ListCardRender}
			ListEmptyComponent={<EmptyList />}
			ItemSeparatorComponent={SeparatorItem}
			ListFooterComponent={
				<View className="py-4">
					<CreateListButton />
				</View>
			}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
			}
		/>
	);
}
