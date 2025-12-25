import { useMemo } from "react";
import {
	ActivityIndicator,
	FlatList,
	useWindowDimensions,
	View,
} from "react-native";
import { useUserCategories } from "@/api/categories.api";
import { Text } from "@/components/ui/Text";
import { AddCategoryCard } from "./AddCategoryCard";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
	searchQuery: string;
}

export function CategoryGrid(props: CategoryGridProps) {
	const { searchQuery } = props;
	const { data: categories, isLoading, isError } = useUserCategories();
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

	type GridItem =
		| { type: "category"; data: (typeof filteredCategories)[number] }
		| { type: "add" };

	const gridItems: GridItem[] = useMemo(() => {
		const items: GridItem[] = filteredCategories.map((category) => ({
			type: "category" as const,
			data: category,
		}));
		items.push({ type: "add" as const });
		return items;
	}, [filteredCategories]);

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

	return (
		<FlatList
			data={gridItems}
			keyExtractor={(item) =>
				item.type === "add" ? "add-category" : item.data.id
			}
			numColumns={3}
			contentContainerClassName="px-5 pb-4"
			renderItem={({ item }) => {
				if (item.type === "add") {
					return <AddCategoryCard width={itemWidth} />;
				}
				return <CategoryCard category={item.data} width={itemWidth} />;
			}}
		/>
	);
}
