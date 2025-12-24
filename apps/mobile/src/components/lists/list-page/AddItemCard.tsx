import { Ban, GripVertical, Plus } from "lucide-react-native";
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { Alert, Pressable, type TextInput, View } from "react-native";
import { useCategories } from "@/api/categories.api";
import { useCreateItem } from "@/api/items.api";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { getCategoryIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { CategorySelectDialog } from "./CategorySelectDialog";

interface AddItemCardProps {
	listId: string;
	onInputFocus?: () => void;
}

export interface AddItemCardRef {
	focus: () => void;
}

export const AddItemCard = forwardRef<AddItemCardRef, AddItemCardProps>(
	function AddItemCard(props, ref) {
		const { listId, onInputFocus } = props;

		const titleInputRef = useRef<TextInput>(null);
		const descriptionInputRef = useRef<TextInput>(null);
		const isFocusingDescriptionRef = useRef(false);
		const isCreatingRef = useRef(false);
		const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

		useImperativeHandle(ref, () => ({
			focus: () => {
				titleInputRef.current?.focus();
			},
		}));

		const [title, setTitle] = useState("");
		const [description, setDescription] = useState("");
		const [categoryId, setCategoryId] = useState<string | null>(null);
		const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

		const { mutate: createItem, isPending } = useCreateItem(listId);
		const { data: categories = [] } = useCategories();

		const selectedCategory = useMemo(() => {
			if (!categoryId) return null;
			return categories.find((cat) => cat.id === categoryId) ?? null;
		}, [categoryId, categories]);

		const CategoryIconComponent = selectedCategory
			? getCategoryIcon(selectedCategory.icon)
			: null;

		const clearBlurTimeout = useCallback(() => {
			if (blurTimeoutRef.current) {
				clearTimeout(blurTimeoutRef.current);
				blurTimeoutRef.current = null;
			}
		}, []);

		const resetForm = useCallback(() => {
			setTitle("");
			setDescription("");
			setCategoryId(null);
		}, []);

		const handleCreate = useCallback(() => {
			if (isPending || isCreatingRef.current) return;

			const trimmedTitle = title.trim();
			if (!trimmedTitle) return;

			isCreatingRef.current = true;

			createItem(
				{
					title: trimmedTitle,
					description: description.trim(),
					categoryId,
				},
				{
					onSuccess: () => {
						resetForm();
						isCreatingRef.current = false;
						setTimeout(() => {
							titleInputRef.current?.focus();
						}, 50);
					},
					onError: () => {
						isCreatingRef.current = false;
						Alert.alert(
							"Błąd",
							"Nie udało się dodać elementu. Spróbuj ponownie.",
						);
					},
				},
			);
		}, [createItem, isPending, title, description, categoryId, resetForm]);

		const handleTitleSubmit = useCallback(() => {
			isFocusingDescriptionRef.current = true;
			descriptionInputRef.current?.focus();
		}, []);

		const handleInputFocus = useCallback(() => {
			onInputFocus?.();
		}, [onInputFocus]);

		const handleTitleBlur = useCallback(() => {
			clearBlurTimeout();

			blurTimeoutRef.current = setTimeout(() => {
				if (!isFocusingDescriptionRef.current && !isCreatingRef.current) {
					if (title.trim()) {
						handleCreate();
					}
				}
				isFocusingDescriptionRef.current = false;
			}, 150);
		}, [title, handleCreate, clearBlurTimeout]);

		const handleDescriptionBlur = useCallback(() => {
			clearBlurTimeout();

			if (!isCreatingRef.current && title.trim()) {
				handleCreate();
			}
		}, [title, handleCreate, clearBlurTimeout]);

		const canSubmit = title.trim().length > 0 && !isPending;

		return (
			<Card className="flex-row items-center gap-3 px-4 py-3">
				<View className="size-8 items-center justify-center">
					<Icon
						as={GripVertical}
						className="text-muted-foreground/30"
						size={18}
					/>
				</View>

				<Checkbox checked={false} onCheckedChange={() => {}} disabled />

				<Pressable
					onPress={() => setIsCategoryDialogOpen(true)}
					className={cn(
						"size-8 items-center justify-center rounded-full",
						CategoryIconComponent ? "bg-primary/10" : "bg-muted",
					)}
					hitSlop={4}
				>
					<Icon
						as={CategoryIconComponent ?? Ban}
						className={
							CategoryIconComponent ? "text-primary" : "text-muted-foreground"
						}
						size={16}
					/>
				</Pressable>

				<View className="flex-1 gap-1">
					<Input
						ref={titleInputRef}
						value={title}
						onChangeText={setTitle}
						onFocus={handleInputFocus}
						onBlur={handleTitleBlur}
						onSubmitEditing={handleTitleSubmit}
						placeholder="Tytuł elementu..."
						editable={!isPending}
						returnKeyType="next"
						className="h-auto min-h-0 border-0 bg-transparent dark:bg-transparent p-0 py-0 shadow-none text-base font-medium text-foreground"
					/>

					<Input
						ref={descriptionInputRef}
						value={description}
						onChangeText={setDescription}
						onFocus={handleInputFocus}
						onBlur={handleDescriptionBlur}
						onSubmitEditing={handleCreate}
						placeholder="Dodatkowy opis..."
						editable={!isPending}
						returnKeyType="done"
						className="h-auto min-h-0 border-0 bg-transparent dark:bg-transparent p-0 py-0 shadow-none text-sm text-muted-foreground"
						textAlignVertical="top"
					/>
				</View>

				<Pressable
					onPress={handleCreate}
					disabled={!canSubmit}
					className="size-8 items-center justify-center rounded-full active:bg-primary/20"
					hitSlop={8}
				>
					<Icon
						as={Plus}
						className={canSubmit ? "text-primary" : "text-muted-foreground/50"}
						size={18}
					/>
				</Pressable>

				<CategorySelectDialog
					isOpen={isCategoryDialogOpen}
					onOpenChange={setIsCategoryDialogOpen}
					currentCategoryId={categoryId}
					onSelectCategory={setCategoryId}
				/>
			</Card>
		);
	},
);
