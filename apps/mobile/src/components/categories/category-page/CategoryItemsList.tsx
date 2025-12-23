import type { CategoryItem } from "@collab-list/shared/types";
import { Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { useDeleteCategoryItem } from "@/api/categories.api";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { EditCategoryItemDialog } from "./EditCategoryItemDialog";

interface CategoryItemsListProps {
	categoryId: string;
	items: CategoryItem[];
}

export function CategoryItemsList(props: CategoryItemsListProps) {
	const { categoryId, items } = props;

	if (items.length === 0) {
		return (
			<View className="flex-1 items-center justify-center px-6">
				<Text className="text-lg font-medium text-muted-foreground text-center">
					Brak elementów w tej kategorii
				</Text>
				<Text className="text-sm text-muted-foreground text-center mt-1">
					Dodaj pierwszy element poniżej
				</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={items}
			keyExtractor={(item) => item.id}
			contentContainerClassName="px-6"
			renderItem={({ item }) => (
				<CategoryItemRow categoryId={categoryId} item={item} />
			)}
			ItemSeparatorComponent={() => <View className="h-2" />}
		/>
	);
}

interface CategoryItemRowProps {
	categoryId: string;
	item: CategoryItem;
}

function CategoryItemRow(props: CategoryItemRowProps) {
	const { categoryId, item } = props;
	const [isEditOpen, setIsEditOpen] = useState(false);

	const { mutate: deleteItem, isPending } = useDeleteCategoryItem(categoryId);

	return (
		<>
			<View className="flex-row items-center gap-3 rounded-lg bg-card border border-border p-3">
				<Text className="flex-1 text-base">{item.name}</Text>
				<View className="flex-row gap-1">
					<Pressable
						onPress={() => setIsEditOpen(true)}
						className="size-8 items-center justify-center rounded-md active:bg-accent"
						disabled={isPending}
					>
						<Icon as={Pencil} className="text-muted-foreground" size={16} />
					</Pressable>
					<Pressable
						onPress={() =>
							deleteItem(item.id, {
								onError: () => {
									Alert.alert("Błąd", "Nie udało się usunąć elementu.");
								},
							})
						}
						className="size-8 items-center justify-center rounded-md active:bg-accent"
						disabled={isPending}
					>
						<Icon as={Trash2} className="text-destructive" size={16} />
					</Pressable>
				</View>
			</View>
			<EditCategoryItemDialog
				categoryId={categoryId}
				item={item}
				isOpen={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
		</>
	);
}
