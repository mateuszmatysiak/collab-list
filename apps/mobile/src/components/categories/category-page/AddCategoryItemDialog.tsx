import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";
import { useCreateCategoryItem } from "@/api/categories.api";
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

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 500;

interface AddCategoryItemDialogProps {
	categoryId: string;
}

export function AddCategoryItemDialog(props: AddCategoryItemDialogProps) {
	const { categoryId } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");

	const { mutate: createItem, isPending } = useCreateCategoryItem(categoryId);

	function handleCreate() {
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

		createItem(
			{ name: trimmedName },
			{
				onSuccess: () => {
					setName("");
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
	}

	function handleClose() {
		setName("");
		setNameError("");
		setIsOpen(false);
	}

	function handleChangeName(text: string) {
		setName(text);
		if (nameError) setNameError("");
	}

	return (
		<>
			<Button onPress={() => setIsOpen(true)} size="lg" className="w-full">
				<Icon as={Plus} className="text-primary-foreground" size={20} />
				<Text>Dodaj element</Text>
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nowy element</DialogTitle>
						<DialogDescription>
							Dodaj nowy element do kategorii.
						</DialogDescription>
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
						<Button
							variant="outline"
							onPress={handleClose}
							disabled={isPending}
						>
							<Text>Anuluj</Text>
						</Button>
						<Button onPress={handleCreate} disabled={!name.trim() || isPending}>
							<Text>{isPending ? "Dodawanie..." : "Dodaj"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
