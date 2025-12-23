import type { CategoryItemWithCategory } from "@collab-list/shared/types";
import * as LucideIcons from "lucide-react-native";
import { Plus } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
	Alert,
	Keyboard,
	Pressable,
	ScrollView,
	type TextInput,
	View,
} from "react-native";
import { useSearchCategoryItems } from "@/api/categories.api";
import { useCreateItem } from "@/api/items.api";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { useDebounce } from "@/hooks/useDebounce";

const DEBOUNCE_MS = 300;

function getCategoryIcon(iconName: string): LucideIcons.LucideIcon {
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcons.LucideIcon
	>;
	return icons[iconName] || LucideIcons.FolderOpen;
}

interface AddItemCardProps {
	listId: string;
	onItemCreated?: (itemId: string) => void;
}

export function AddItemCard(props: AddItemCardProps) {
	const { listId, onItemCreated } = props;

	const inputRef = useRef<TextInput>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState("");

	const debouncedQuery = useDebounce(title.trim(), DEBOUNCE_MS);
	const { mutate: createItem, isPending } = useCreateItem(listId);
	const { data: suggestions } = useSearchCategoryItems(debouncedQuery);

	const showSuggestions =
		isEditing &&
		debouncedQuery.length >= 1 &&
		suggestions &&
		suggestions.length > 0;

	const handleStartEditing = useCallback(() => {
		setIsEditing(true);
		setTimeout(() => inputRef.current?.focus(), 50);
	}, []);

	const handleCreate = useCallback(
		(itemTitle: string, categoryId: string | null) => {
			if (isPending) return;

			createItem(
				{
					title: itemTitle,
					description: "",
					categoryId,
				},
				{
					onSuccess: (newItem) => {
						setTitle("");
						setIsEditing(false);
						Keyboard.dismiss();
						onItemCreated?.(newItem.id);
					},
					onError: () => {
						Alert.alert(
							"Błąd",
							"Nie udało się dodać elementu. Spróbuj ponownie.",
						);
					},
				},
			);
		},
		[createItem, isPending, onItemCreated],
	);

	const handleSelectSuggestion = useCallback(
		(suggestion: CategoryItemWithCategory) => {
			handleCreate(suggestion.name, suggestion.categoryId);
		},
		[handleCreate],
	);

	const handleSubmit = useCallback(() => {
		const trimmedTitle = title.trim();
		if (!trimmedTitle) {
			setIsEditing(false);
			Keyboard.dismiss();
			return;
		}

		const exactMatch = suggestions?.find(
			(s) => s.name.toLowerCase().trim() === trimmedTitle.toLowerCase(),
		);

		handleCreate(trimmedTitle, exactMatch?.categoryId ?? null);
	}, [title, suggestions, handleCreate]);

	const handleBlur = useCallback(() => {
		setTimeout(() => {
			if (!title.trim()) {
				setIsEditing(false);
			}
		}, 150);
	}, [title]);

	if (!isEditing) {
		return (
			<Pressable
				onPress={handleStartEditing}
				disabled={isPending}
				className="flex-row items-center gap-3 px-4 py-3 active:opacity-70"
			>
				<View className="size-8 items-center justify-center rounded-full bg-primary/10">
					<Icon as={Plus} className="text-primary" size={18} />
				</View>
				<Text className="text-muted-foreground">
					{isPending ? "Dodawanie..." : "Dodaj element"}
				</Text>
			</Pressable>
		);
	}

	return (
		<View className="gap-2 px-4 py-3">
			<View className="flex-row items-center gap-3">
				<View className="size-8 items-center justify-center rounded-full bg-primary/10">
					<Icon as={Plus} className="text-primary" size={18} />
				</View>
				<Input
					ref={inputRef}
					value={title}
					onChangeText={setTitle}
					onBlur={handleBlur}
					onSubmitEditing={handleSubmit}
					placeholder="Wpisz nazwę elementu..."
					editable={!isPending}
					returnKeyType="done"
					className="h-auto min-h-0 flex-1 border-0 bg-transparent p-0 py-0 shadow-none text-base"
				/>
			</View>

			{showSuggestions && (
				<View className="ml-11 max-h-48 rounded-lg border border-border bg-card">
					<ScrollView keyboardShouldPersistTaps="handled">
						{suggestions.map((suggestion) => {
							const CategoryIcon = getCategoryIcon(suggestion.categoryIcon);

							return (
								<Pressable
									key={suggestion.id}
									onPress={() => handleSelectSuggestion(suggestion)}
									className="flex-row items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0 active:bg-accent"
								>
									<View className="size-6 items-center justify-center rounded-full bg-primary/10">
										<Icon
											as={CategoryIcon}
											className="text-primary"
											size={14}
										/>
									</View>
									<Text className="flex-1 text-sm" numberOfLines={1}>
										{suggestion.name}
									</Text>
									<Text className="text-xs text-muted-foreground">
										{suggestion.categoryName}
									</Text>
								</Pressable>
							);
						})}
					</ScrollView>
				</View>
			)}
		</View>
	);
}
