import type { ListWithDetails } from "@collab-list/shared/types";
import { UserPlus } from "lucide-react-native";
import { useState } from "react";
import { Alert, type GestureResponderEvent, Pressable } from "react-native";
import { useShareList } from "@/api/shares.api";
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

interface AddUserDialogProps {
	list: ListWithDetails;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

export function AddUserDialog(props: AddUserDialogProps) {
	const { list } = props;
	const [isAddUserOpen, setIsAddUserOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const { mutate: shareList, isPending } = useShareList(list.id);

	function handleAddUser(e: GestureResponderEvent) {
		e.stopPropagation();
		setIsAddUserOpen(true);
	}

	function handleShare() {
		const trimmedEmail = email.trim();

		if (!trimmedEmail) {
			setEmailError("Email jest wymagany");
			return;
		}

		if (!isValidEmail(trimmedEmail)) {
			setEmailError("Nieprawidłowy format email");
			return;
		}

		setEmailError("");

		shareList(
			{ email: trimmedEmail },
			{
				onSuccess: () => {
					setEmail("");
					setIsAddUserOpen(false);
				},
				onError: () => {
					Alert.alert(
						"Błąd",
						"Nie udało się udostępnić listy. Sprawdź czy użytkownik istnieje.",
					);
				},
			},
		);
	}

	function handleClose() {
		setEmail("");
		setEmailError("");
		setIsAddUserOpen(false);
	}

	return (
		<>
			<Pressable
				onPress={handleAddUser}
				className="size-8 items-center justify-center rounded-full active:bg-accent"
				hitSlop={8}
			>
				<Icon as={UserPlus} className="text-muted-foreground" size={18} />
			</Pressable>

			<Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dodaj użytkownika</DialogTitle>
						<DialogDescription>
							Udostępnij listę innemu użytkownikowi.
						</DialogDescription>
					</DialogHeader>
					<Input
						placeholder="Email użytkownika"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
							if (emailError) setEmailError("");
						}}
						editable={!isPending}
						autoFocus
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					{emailError ? (
						<Text className="text-sm text-destructive">{emailError}</Text>
					) : null}
					<DialogFooter>
						<Button
							variant="outline"
							onPress={handleClose}
							disabled={isPending}
						>
							<Text>Anuluj</Text>
						</Button>
						<Button onPress={handleShare} disabled={!email.trim() || isPending}>
							<Text>{isPending ? "Dodawanie..." : "Dodaj"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
