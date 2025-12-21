import type { CategoryItem } from "@collab-list/shared/types";
import { useState } from "react";
import { Alert } from "react-native";
import { useUpdateCategoryItem } from "@/api/categories.api";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 500;

interface EditPredefinedItemDialogProps {
	categoryId: string;
	item: CategoryItem;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditPredefinedItemDialog(props: EditPredefinedItemDialogProps) {
	const { categoryId, item, isOpen, onOpenChange } = props;

	const [name, setName] = useState(item.name);
	const [nameError, setNameError] = useState("");

	const { mutate: updateItem, isPending } = useUpdateCategoryItem(categoryId);

	function handleOpenChange(open: boolean) {
		if (open) {
			setName(item.name);
			setNameError("");
		}
		onOpenChange(open);
	}

	function handleSave() {
		const trimmedName = name.trim();

		if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
			setNameError("Nazwa elementu jest wymagana");
			return;
		}

		if (trimmedName.length > MAX_NAME_LENGTH) {
			setNameError(`Nazwa może mieć maksymalnie ${MAX_NAME_LENGTH} znaków`);
			return;
		}

		setNameError("");

		updateItem(
			{ itemId: item.id, data: { name: trimmedName } },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
				onError: () => {
					Alert.alert(
						"Błąd",
						"Nie udało się zaktualizować elementu. Spróbuj ponownie.",
					);
				},
			},
		);
	}

	function handleClose() {
		setName(item.name);
		setNameError("");
		onOpenChange(false);
	}

	function handleChangeName(text: string) {
		setName(text);
		if (nameError) setNameError("");
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edytuj element</DialogTitle>
					<DialogDescription>Zmień nazwę elementu.</DialogDescription>
				</DialogHeader>
				<Input
					placeholder="Nazwa elementu"
					value={name}
					onChangeText={handleChangeName}
					editable={!isPending}
					autoFocus
					maxLength={MAX_NAME_LENGTH}
				/>
				{nameError ? (
					<Text className="text-sm text-destructive">{nameError}</Text>
				) : null}
				<DialogFooter>
					<Button variant="outline" onPress={handleClose} disabled={isPending}>
						<Text>Anuluj</Text>
					</Button>
					<Button
						onPress={handleSave}
						disabled={!name.trim() || name.trim() === item.name || isPending}
					>
						<Text>{isPending ? "Zapisywanie..." : "Zapisz"}</Text>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
