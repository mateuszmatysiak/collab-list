import type { Category } from "@collab-list/shared/types";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { getCategoryIcon } from "@/lib/icons";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";

interface CategoryCardProps {
	category: Category;
	width: number;
}

export function CategoryCard(props: CategoryCardProps) {
	const { category, width } = props;
	const IconComponent = getCategoryIcon(category.icon);

	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	function handlePress() {
		setIsEditOpen(true);
	}

	function handleLongPress() {
		Alert.alert(category.name, "Wybierz akcję", [
			{
				text: "Edytuj",
				onPress: () => setIsEditOpen(true),
			},
			{
				text: "Usuń",
				onPress: () => setIsDeleteOpen(true),
				style: "destructive",
			},
			{
				text: "Anuluj",
				style: "cancel",
			},
		]);
	}

	function handleDeletePress() {
		setIsDeleteOpen(true);
	}

	return (
		<>
			<View className="m-1 aspect-square" style={{ width }}>
				<Pressable
					onPress={handlePress}
					onLongPress={handleLongPress}
					delayLongPress={300}
					className="flex-1"
				>
					<View className="flex-1 items-center justify-center rounded-xl bg-card border border-border p-3 relative">
						<Pressable
							onPress={handleDeletePress}
							onStartShouldSetResponder={() => true}
							className="absolute top-2 right-2 p-1 rounded-full bg-destructive/10 active:bg-destructive/20 z-10"
						>
							<Icon as={Trash2} className="text-destructive" size={16} />
						</Pressable>
						<View className="size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
							<Icon as={IconComponent} className="text-primary" size={24} />
						</View>
						<Text className="text-sm font-medium text-center" numberOfLines={2}>
							{category.name}
						</Text>
					</View>
				</Pressable>
			</View>

			<EditCategoryDialog
				category={category}
				isOpen={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>

			<DeleteCategoryDialog
				category={category}
				isOpen={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
			/>
		</>
	);
}
