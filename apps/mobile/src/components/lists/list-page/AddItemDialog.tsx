import type { CategoryItemWithCategory } from "@collab-list/shared/types";
import { Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSearchCategoryItems } from "@/api/categories.api";
import { useCreateItem } from "@/api/items.api";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { useDebounce } from "@/hooks/useDebounce";

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 500;
const DEBOUNCE_MS = 300;

interface AddItemDialogProps {
	listId: string;
}

function validateTitle(title: string): string | null {
	const trimmed = title.trim();

	if (!trimmed || trimmed.length < MIN_TITLE_LENGTH) {
		return "Tytuł elementu jest wymagany";
	}

	if (trimmed.length > MAX_TITLE_LENGTH) {
		return `Tytuł może mieć maksymalnie ${MAX_TITLE_LENGTH} znaków`;
	}

	return null;
}

function findMatchingCategory(
	title: string,
	suggestions: CategoryItemWithCategory[] | undefined,
): string | null {
	if (!suggestions || suggestions.length === 0) return null;

	const exactMatch = suggestions.find(
		(suggestion) =>
			suggestion.name.toLowerCase().trim() === title.toLowerCase().trim(),
	);

	return exactMatch?.categoryId ?? null;
}

export function AddItemDialog(props: AddItemDialogProps) {
	const { listId } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [titleError, setTitleError] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);

	const debouncedQuery = useDebounce(title.trim(), DEBOUNCE_MS);
	const { mutate: createItem, isPending } = useCreateItem(listId);
	const { data: suggestions } = useSearchCategoryItems(debouncedQuery);

	const handleTitleChange = useCallback((text: string) => {
		setTitle(text);
		setTitleError("");
		setSelectedCategoryId(null);
	}, []);

	const resetState = useCallback(() => {
		setTitle("");
		setTitleError("");
		setSelectedCategoryId(null);
	}, []);

	const handleCreate = useCallback(() => {
		const trimmedTitle = title.trim();
		const error = validateTitle(trimmedTitle);

		if (error) {
			setTitleError(error);
			return;
		}

		const categoryId =
			selectedCategoryId ?? findMatchingCategory(trimmedTitle, suggestions);

		createItem(
			{
				title: trimmedTitle,
				description: "",
				categoryId,
			},
			{
				onSuccess: () => {
					resetState();
					setIsOpen(false);
				},
				onError: () => {
					Alert.alert(
						"Błąd",
						"Nie udało się dodać elementu. Spróbuj ponownie.",
					);
				},
			},
		);
	}, [title, selectedCategoryId, suggestions, createItem, resetState]);

	const handleClose = useCallback(() => {
		resetState();
		setIsOpen(false);
	}, [resetState]);

	const handleSelectSuggestion = useCallback(
		(suggestion: CategoryItemWithCategory) => {
			setTitle(suggestion.name);
			setSelectedCategoryId(suggestion.categoryId);
		},
		[],
	);

	const handleOpenChange = useCallback((open: boolean) => {
		setIsOpen(open);
	}, []);

	const showSuggestions =
		debouncedQuery.length >= 1 && suggestions && suggestions.length > 0;

	const isSubmitDisabled = !title.trim() || isPending;

	return (
		<>
			<Button onPress={() => setIsOpen(true)} size="lg" className="w-full">
				<Icon as={Plus} className="text-primary-foreground" size={20} />
				<Text>Dodaj element</Text>
			</Button>

			<Dialog open={isOpen} onOpenChange={handleOpenChange}>
				<DialogContent className="max-h-[80%]">
					<DialogHeader>
						<DialogTitle>Nowy element</DialogTitle>
						<DialogDescription>Dodaj nowy element do listy.</DialogDescription>
					</DialogHeader>

					<View className="gap-2">
						<Input
							placeholder="Tytuł elementu"
							value={title}
							onChangeText={handleTitleChange}
							editable={!isPending}
							autoFocus
							maxLength={MAX_TITLE_LENGTH}
						/>
						{titleError ? (
							<Text className="text-sm text-destructive">{titleError}</Text>
						) : null}

						{showSuggestions && (
							<View className="max-h-40 rounded-lg border border-border bg-card">
								<ScrollView>
									{suggestions.map((suggestion) => (
										<Pressable
											key={suggestion.id}
											onPress={() => handleSelectSuggestion(suggestion)}
											className="flex-row items-center justify-between border-b border-border px-3 py-2.5 last:border-b-0 active:bg-accent"
										>
											<Text className="flex-1 text-sm" numberOfLines={1}>
												{suggestion.name}
											</Text>
											<Text className="ml-2 text-xs text-muted-foreground">
												{suggestion.categoryName}
											</Text>
										</Pressable>
									))}
								</ScrollView>
							</View>
						)}
					</View>

					<DialogFooter>
						<Button
							variant="outline"
							onPress={handleClose}
							disabled={isPending}
						>
							<Text>Anuluj</Text>
						</Button>
						<Button onPress={handleCreate} disabled={isSubmitDisabled}>
							<Text>{isPending ? "Dodawanie..." : "Dodaj"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
