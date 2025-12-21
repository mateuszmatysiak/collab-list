import { router, useLocalSearchParams } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import { ArrowLeft, Pencil } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategory } from "@/api/categories.api";
import { AddPredefinedItemDialog } from "@/components/categories/AddPredefinedItemDialog";
import { DeleteCategoryDialog } from "@/components/categories/DeleteCategoryDialog";
import { EditCategoryDialog } from "@/components/categories/EditCategoryDialog";
import { PredefinedItemsList } from "@/components/categories/PredefinedItemsList";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

function getCategoryIcon(iconName: string): LucideIcons.LucideIcon {
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcons.LucideIcon
	>;
	return icons[iconName] || LucideIcons.FolderOpen;
}

export default function CategoryDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: category, isLoading, isError } = useCategory(id);
	const [isEditOpen, setIsEditOpen] = useState(false);

	if (!id) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-lg font-medium text-destructive">
						Nieprawidłowy identyfikator kategorii
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" />
				</View>
			</SafeAreaView>
		);
	}

	if (isError || !category) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center gap-2 px-6">
					<Text className="text-lg font-medium text-destructive">
						Błąd ładowania kategorii
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const IconComponent = getCategoryIcon(category.icon);

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-row items-center gap-3 px-4 py-3">
				<Pressable
					onPress={() => router.push("/(tabs)/categories")}
					className="size-10 items-center justify-center rounded-full active:bg-accent"
					hitSlop={8}
				>
					<Icon as={ArrowLeft} className="text-foreground" size={20} />
				</Pressable>
				<View className="flex-1 flex-row items-center gap-2">
					<View className="size-8 items-center justify-center rounded-lg bg-primary/10">
						<Icon as={IconComponent} className="text-primary" size={18} />
					</View>
					<Text className="text-xl font-bold" numberOfLines={1}>
						{category.name}
					</Text>
				</View>
				<View className="flex-row gap-2">
					<Button
						variant="outline"
						size="icon"
						onPress={() => setIsEditOpen(true)}
					>
						<Icon as={Pencil} className="text-foreground" size={18} />
					</Button>
					<DeleteCategoryDialog category={category} />
				</View>
			</View>

			<View className="px-6 pb-3">
				<Text className="text-sm text-muted-foreground">
					{category.itemsCount} elementów
				</Text>
			</View>

			<PredefinedItemsList categoryId={category.id} items={category.items} />

			<View className="px-6 pb-6">
				<AddPredefinedItemDialog categoryId={category.id} />
			</View>

			<EditCategoryDialog
				category={category}
				isOpen={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
		</SafeAreaView>
	);
}
