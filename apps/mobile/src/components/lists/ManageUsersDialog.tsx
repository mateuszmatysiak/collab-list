import type { ListWithDetails, ShareWithUser } from "@collab-list/shared/types";
import { UserPlus, X } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useRemoveShare, useShareList, useShares } from "@/api/shares.api";
import { UserAvatar } from "@/components/lists/UserAvatar";
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
import { useAuth } from "@/contexts/auth.context";

interface ManageUsersDialogProps {
	list: ListWithDetails;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

export function ManageUsersDialog(props: ManageUsersDialogProps) {
	const { list, open, onOpenChange } = props;

	const { user } = useAuth();

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");

	const { data: sharesData } = useShares(list.id);
	const shares = (sharesData?.shares as ShareWithUser[]) ?? [];

	const { mutate: shareList, isPending: isSharing } = useShareList(list.id);

	const isOwner = user?.id === list.authorId;

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
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Zarządzaj użytkownikami</DialogTitle>
					<DialogDescription>
						Użytkownicy mający dostęp do listy.
					</DialogDescription>
				</DialogHeader>

				<ScrollView className="max-h-48">
					{shares.length === 0 ? (
						<Text className="text-sm text-muted-foreground py-2">
							Brak udostępnionych użytkowników
						</Text>
					) : (
						<View className="gap-2">
							{shares.map((share) => (
								<ShareItem
									key={share.id}
									share={share}
									listId={list.id}
									canRemove={isOwner}
								/>
							))}
						</View>
					)}
				</ScrollView>

				{isOwner && (
					<View className="gap-2 pt-2 border-t border-border">
						<Text className="text-sm font-medium">Dodaj użytkownika</Text>
						<View className="flex-row gap-2">
							<Input
								className="flex-1"
								placeholder="Email użytkownika"
								value={email}
								onChangeText={(text) => {
									setEmail(text);
									if (emailError) setEmailError("");
								}}
								editable={!isSharing}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
							<Button
								size="icon"
								onPress={handleShare}
								disabled={!email.trim() || isSharing}
							>
								<Icon
									as={UserPlus}
									className="text-primary-foreground"
									size={18}
								/>
							</Button>
						</View>
						{emailError ? (
							<Text className="text-sm text-destructive">{emailError}</Text>
						) : null}
					</View>
				)}

				<DialogFooter>
					<Button variant="outline" onPress={handleClose}>
						<Text>Zamknij</Text>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface ShareItemProps {
	share: ShareWithUser;
	listId: string;
	canRemove: boolean;
}

function ShareItem(props: ShareItemProps) {
	const { share, listId, canRemove } = props;
	const { mutate: removeShare, isPending } = useRemoveShare(
		listId,
		share.userId,
	);

	function handleRemove() {
		Alert.alert(
			"Usuń użytkownika",
			`Czy na pewno chcesz usunąć ${share.userName} z listy?`,
			[
				{ text: "Anuluj", style: "cancel" },
				{
					text: "Usuń",
					style: "destructive",
					onPress: () => {
						removeShare(undefined, {
							onError: () => {
								Alert.alert("Błąd", "Nie udało się usunąć użytkownika.");
							},
						});
					},
				},
			],
		);
	}

	return (
		<View className="flex-row items-center gap-3 py-1">
			<UserAvatar name={share.userName} size="sm" />
			<View className="flex-1">
				<Text className="text-sm font-medium">{share.userName}</Text>
				<Text className="text-xs text-muted-foreground">{share.userEmail}</Text>
			</View>
			{canRemove && (
				<Pressable
					onPress={handleRemove}
					disabled={isPending}
					className="size-8 items-center justify-center rounded-full active:bg-accent"
					hitSlop={8}
				>
					<Icon
						as={X}
						className={isPending ? "text-muted" : "text-muted-foreground"}
						size={16}
					/>
				</Pressable>
			)}
		</View>
	);
}
