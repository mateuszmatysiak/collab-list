import type { Category } from "@collab-list/shared/types";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useUpdateCategory } from "@/api/categories.api";
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
import { Label } from "@/components/ui/Label";
import { Text } from "@/components/ui/Text";
import { IconPicker } from "./IconPicker";

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 255;

interface EditCategoryDialogProps {
	category: Category;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog(props: EditCategoryDialogProps) {
	const { category, isOpen, onOpenChange } = props;

	const [name, setName] = useState(category.name);
	const [icon, setIcon] = useState(category.icon);
	const [nameError, setNameError] = useState("");

	const { mutate: updateCategory, isPending } = useUpdateCategory(category.id);

	useEffect(() => {
		if (isOpen) {
			setName(category.name);
			setIcon(category.icon);
			setNameError("");
		}
	}, [isOpen, category.name, category.icon]);

	function handleSave() {
		const trimmedName = name.trim();

		if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
			setNameError("Nazwa kategorii jest wymagana");
			return;
		}

		if (trimmedName.length > MAX_NAME_LENGTH) {
			setNameError(`Nazwa może mieć maksymalnie ${MAX_NAME_LENGTH} znaków`);
			return;
		}

		setNameError("");

		updateCategory(
			{ name: trimmedName, icon },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
				onError: () => {
					Alert.alert(
						"Błąd",
						"Nie udało się zaktualizować kategorii. Spróbuj ponownie.",
					);
				},
			},
		);
	}

	function handleClose() {
		setName(category.name);
		setIcon(category.icon);
		setNameError("");
		onOpenChange(false);
	}

	const hasChanges = name.trim() !== category.name || icon !== category.icon;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[80%]">
				<DialogHeader>
					<DialogTitle>Edytuj kategorię</DialogTitle>
					<DialogDescription>
						Zmień nazwę lub ikonę kategorii.
					</DialogDescription>
				</DialogHeader>

				<ScrollView className="max-h-64">
					<View className="gap-4">
						<View className="gap-2">
							<Label>Nazwa kategorii</Label>
							<Input
								placeholder="np. Artykuły biurowe"
								value={name}
								onChangeText={(text) => {
									setName(text);
									if (nameError) setNameError("");
								}}
								editable={!isPending}
								maxLength={MAX_NAME_LENGTH}
							/>
							{nameError ? (
								<Text className="text-sm text-destructive">{nameError}</Text>
							) : null}
						</View>

						<View className="gap-2">
							<Label>Ikona</Label>
							<IconPicker selectedIcon={icon} onSelectIcon={setIcon} />
						</View>
					</View>
				</ScrollView>

				<DialogFooter>
					<Button variant="outline" onPress={handleClose} disabled={isPending}>
						<Text>Anuluj</Text>
					</Button>
					<Button
						onPress={handleSave}
						disabled={!name.trim() || !hasChanges || isPending}
					>
						<Text>{isPending ? "Zapisywanie..." : "Zapisz"}</Text>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
