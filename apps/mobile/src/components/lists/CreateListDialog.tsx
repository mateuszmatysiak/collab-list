import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable } from "react-native";
import { useCreateList } from "@/api/lists.api";
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

export function CreateListDialog() {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");

	const { mutate: createList, isPending } = useCreateList();

	function handleCreate() {
		const trimmedName = name.trim();

		if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
			setNameError("Nazwa listy jest wymagana");
			return;
		}

		if (trimmedName.length > MAX_NAME_LENGTH) {
			setNameError(`Nazwa może mieć maksymalnie ${MAX_NAME_LENGTH} znaków`);
			return;
		}

		setNameError("");

		createList(
			{ name: trimmedName },
			{
				onSuccess: () => {
					setName("");
					setIsCreateOpen(false);
				},
				onError: () => {
					Alert.alert(
						"Błąd",
						"Nie udało się utworzyć listy. Spróbuj ponownie.",
					);
				},
			},
		);
	}

	function handleClose() {
		setName("");
		setNameError("");
		setIsCreateOpen(false);
	}

	return (
		<>
			<Pressable
				onPress={() => setIsCreateOpen(true)}
				className="size-10 items-center justify-center rounded-full bg-primary active:bg-primary/90"
			>
				<Icon as={Plus} className="text-primary-foreground" size={20} />
			</Pressable>

			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nowa lista</DialogTitle>
						<DialogDescription>Utwórz nową listę zakupów.</DialogDescription>
					</DialogHeader>
					<Input
						placeholder="Nazwa listy"
						value={name}
						onChangeText={(text) => {
							setName(text);
							if (nameError) setNameError("");
						}}
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
							<Text>{isPending ? "Tworzenie..." : "Utwórz"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
