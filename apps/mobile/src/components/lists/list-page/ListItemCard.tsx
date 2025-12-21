import type { ListItem } from "@collab-list/shared/types";
import * as LucideIcons from "lucide-react-native";
import { X } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useDeleteItem, useUpdateItem } from "@/api/items.api";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

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

interface ListItemCardProps {
	item: ListItem;
	listId: string;
}

export function ListItemCard(props: ListItemCardProps) {
	const { item, listId } = props;

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [editingTitle, setEditingTitle] = useState(item.title);
	const [editingDescription, setEditingDescription] = useState(
		item.description ?? "",
	);

	const { mutate: updateItem } = useUpdateItem(listId, item.id);
	const { mutate: deleteItem } = useDeleteItem(listId, item.id);

	function handleCheckboxChange(checked: boolean) {
		updateItem(
			{ is_completed: checked },
			{
				onError: () => {
					Alert.alert("Błąd", "Nie udało się zaktualizować elementu.");
				},
			},
		);
	}

	function handleDelete() {
		Alert.alert(
			"Usuwanie elementu",
			"Czy na pewno chcesz usunąć ten element?",
			[
				{ text: "Anuluj", style: "cancel" },
				{
					text: "Usuń",
					style: "destructive",
					onPress: () => deleteItem(),
				},
			],
		);
	}

	function handleTitlePress() {
		setIsEditingTitle(true);
		setEditingTitle(item.title);
	}

	function handleDescriptionPress() {
		setIsEditingDescription(true);
		setEditingDescription(item.description || "");
	}

	function handleTitleBlur() {
		if (editingTitle.trim() && editingTitle !== item.title) {
			updateItem({ title: editingTitle.trim() });
		} else {
			setEditingTitle(item.title);
		}
		setIsEditingTitle(false);
	}

	function handleDescriptionBlur() {
		const trimmedDescription = editingDescription.trim();
		if (trimmedDescription !== (item.description ?? "")) {
			updateItem({ description: trimmedDescription });
		} else {
			setEditingDescription(item.description ?? "");
		}
		setIsEditingDescription(false);
	}

	const CategoryIconComponent = item.categoryIcon
		? getCategoryIcon(item.categoryIcon)
		: null;

	return (
		<Card
			className={cn(
				"flex-row items-center gap-3 px-4 py-3",
				item.isCompleted && "bg-muted",
			)}
		>
			<Checkbox
				checked={item.isCompleted}
				onCheckedChange={handleCheckboxChange}
			/>

			{CategoryIconComponent && (
				<View className="size-8 items-center justify-center rounded-full bg-primary/10">
					<Icon as={CategoryIconComponent} className="text-primary" size={16} />
				</View>
			)}

			<View className="flex-1 gap-1">
				{isEditingTitle ? (
					<Input
						value={editingTitle}
						onChangeText={setEditingTitle}
						onBlur={handleTitleBlur}
						autoFocus
						className={cn(
							"h-auto border-0 bg-transparent p-0 shadow-none",
							"text-base font-medium text-primary/50",
							item.isCompleted && "line-through text-primary/30",
						)}
					/>
				) : (
					<Pressable onPress={handleTitlePress}>
						<Text
							className={cn(
								"text-base font-medium",
								item.isCompleted && "line-through text-muted-foreground",
							)}
						>
							{item.title}
						</Text>
					</Pressable>
				)}

				{isEditingDescription ? (
					<Input
						value={editingDescription}
						onChangeText={setEditingDescription}
						onBlur={handleDescriptionBlur}
						autoFocus
						placeholder="Dodatkowy opis..."
						className="h-auto border-0 bg-transparent p-0 shadow-none text-sm text-primary/70"
					/>
				) : (
					<Pressable onPress={handleDescriptionPress}>
						<Text className="text-sm text-muted-foreground">
							{item.description || "Dodatkowy opis..."}
						</Text>
					</Pressable>
				)}
			</View>

			<Pressable
				onPress={handleDelete}
				className="size-8 items-center justify-center rounded-full active:bg-destructive/20"
				hitSlop={8}
			>
				<Icon as={X} className="text-destructive" size={18} />
			</Pressable>
		</Card>
	);
}
