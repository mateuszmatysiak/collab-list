import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";
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

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 500;

interface AddItemDialogProps {
	listId: string;
}

export function AddItemDialog(props: AddItemDialogProps) {
	const { listId } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [titleError, setTitleError] = useState("");

	const { mutate: createItem, isPending } = useCreateItem(listId);

	function handleCreate() {
		const trimmedTitle = title.trim();

		if (!trimmedTitle || trimmedTitle.length < MIN_TITLE_LENGTH) {
			setTitleError("Tytuł elementu jest wymagany");
			return;
		}

		if (trimmedTitle.length > MAX_TITLE_LENGTH) {
			setTitleError(`Tytuł może mieć maksymalnie ${MAX_TITLE_LENGTH} znaków`);
			return;
		}

		setTitleError("");

		createItem(
			{ title: trimmedTitle, description: "" },
			{
				onSuccess: () => {
					setTitle("");
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
		setTitle("");
		setTitleError("");
		setIsOpen(false);
	}

	function handleTitleChange(text: string) {
		setTitle(text);
		if (titleError) setTitleError("");
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
						<DialogDescription>Dodaj nowy element do listy.</DialogDescription>
					</DialogHeader>
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
					<DialogFooter>
						<Button
							variant="outline"
							onPress={handleClose}
							disabled={isPending}
						>
							<Text>Anuluj</Text>
						</Button>
						<Button
							onPress={handleCreate}
							disabled={!title.trim() || isPending}
						>
							<Text>{isPending ? "Dodawanie..." : "Dodaj"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
