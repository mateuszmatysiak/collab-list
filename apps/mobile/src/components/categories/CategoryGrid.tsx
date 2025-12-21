import { useMemo } from "react";
import {
	ActivityIndicator,
	FlatList,
	useWindowDimensions,
	View,
} from "react-native";
import { useCategories } from "@/api/categories.api";
import { Text } from "@/components/ui/Text";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
	searchQuery: string;
}

export function CategoryGrid(props: CategoryGridProps) {
	const { searchQuery } = props;
	const { data: categories, isLoading, isError } = useCategories();
	const { width } = useWindowDimensions();

	const itemWidth = (width - 40 - 24) / 3;

	const filteredCategories = useMemo(() => {
		if (!categories) return [];
		if (!searchQuery.trim()) return categories;

		const query = searchQuery.toLowerCase().trim();
		return categories.filter((category) =>
			category.name.toLowerCase().includes(query),
		);
	}, [categories, searchQuery]);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center px-6">
				<Text className="text-lg font-medium text-destructive">
					Błąd ładowania kategorii
				</Text>
			</View>
		);
	}

	if (filteredCategories.length === 0) {
		return (
			<View className="flex-1 items-center justify-center px-6">
				<Text className="text-lg font-medium text-muted-foreground text-center">
					{searchQuery.trim() ? "Nie znaleziono kategorii" : "Brak kategorii"}
				</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={filteredCategories}
			keyExtractor={(item) => item.id}
			numColumns={3}
			contentContainerClassName="px-5 pb-4"
			renderItem={({ item }) => (
				<CategoryCard category={item} width={itemWidth} />
			)}
		/>
	);
}
