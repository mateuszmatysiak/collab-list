import * as LucideIcons from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useCategories } from "@/api/categories.api";
import { useItems } from "@/api/items.api";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

function getCategoryIcon(
	iconName: string | null,
): LucideIcons.LucideIcon | null {
	if (!iconName) return null;
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcons.LucideIcon
	>;
	return icons[iconName] || null;
}

interface CategoryFiltersProps {
	listId: string;
	selectedCategoryId: string | null;
	onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilters(props: CategoryFiltersProps) {
	const { listId, selectedCategoryId, onCategoryChange } = props;

	const { data: items } = useItems(listId);
	const { data: allCategories } = useCategories();

	const availableCategories = useMemo(() => {
		if (!items || !allCategories) return [];

		const uniqueCategoryIds = new Set<string>();
		items.forEach((item) => {
			if (item.categoryId) {
				uniqueCategoryIds.add(item.categoryId);
			}
		});

		return allCategories
			.filter((category) => uniqueCategoryIds.has(category.id))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [items, allCategories]);

	if (availableCategories.length === 0) {
		return null;
	}

	return (
		<View className="px-6 pb-4">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-2"
			>
				<Button
					variant={selectedCategoryId === null ? "default" : "outline"}
					size="sm"
					onPress={() => onCategoryChange(null)}
				>
					<Text>Wszystkie kategorie</Text>
				</Button>

				{availableCategories.map((category) => {
					const CategoryIconComponent = getCategoryIcon(category.icon);

					const isSelected = selectedCategoryId === category.id;

					return (
						<Button
							key={category.id}
							variant={isSelected ? "default" : "outline"}
							size="sm"
							onPress={() => onCategoryChange(category.id)}
							className="flex-row items-center gap-2"
						>
							{CategoryIconComponent && (
								<Icon
									as={CategoryIconComponent}
									className={
										isSelected ? "text-primary-foreground" : "text-foreground"
									}
									size={16}
								/>
							)}
							<Text>{category.name}</Text>
						</Button>
					);
				})}
			</ScrollView>
		</View>
	);
}
