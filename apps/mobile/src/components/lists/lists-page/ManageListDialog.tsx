import type { ListWithDetails } from "@collab-list/shared/types";
import { MoreVertical } from "lucide-react-native";
import { useState } from "react";
import { Alert, type GestureResponderEvent, Pressable } from "react-native";
import { useDeleteList, useUpdateList } from "@/api/lists.api";
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
import { useIsListOwner } from "@/hooks/useIsListOwner";

interface ManageListDialogProps {
	list: ListWithDetails;
}

export function ManageListDialog(props: ManageListDialogProps) {
	const { list } = props;

	const isOwner = useIsListOwner(list);

	const [isManageOpen, setIsManageOpen] = useState(false);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
	const [name, setName] = useState(list.name);

	const { mutate: updateList, isPending: isUpdating } = useUpdateList(list.id);
	const { mutate: deleteList, isPending: isDeleting } = useDeleteList(list.id);

	const isPending = isUpdating || isDeleting;

	function handleManage(e: GestureResponderEvent) {
		e.stopPropagation();
		setName(list.name);
		setIsManageOpen(true);
	}

	function handleUpdate() {
		if (!name.trim() || name.trim() === list.name) return;

		updateList(
			{ name: name.trim() },
			{
				onSuccess: () => {
					setIsManageOpen(false);
				},
				onError: () => {
					Alert.alert("Błąd", "Nie udało się zaktualizować listy.");
				},
			},
		);
	}

	function handleDeleteConfirm() {
		setIsDeleteConfirmOpen(true);
	}

	function handleDelete() {
		deleteList(undefined, {
			onSuccess: () => {
				setIsDeleteConfirmOpen(false);
				setIsManageOpen(false);
			},
			onError: () => {
				Alert.alert("Błąd", "Nie udało się usunąć listy.");
			},
		});
	}

	return (
		<>
			<Pressable
				onPress={handleManage}
				className="size-8 items-center justify-center rounded-full active:bg-accent"
				hitSlop={8}
			>
				<Icon as={MoreVertical} className="text-muted-foreground" size={18} />
			</Pressable>

			<Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Zarządzaj listą</DialogTitle>
						<DialogDescription>Edytuj lub usuń listę.</DialogDescription>
					</DialogHeader>
					<Input
						placeholder="Nazwa listy"
						value={name}
						onChangeText={setName}
						editable={!isPending}
						autoFocus
					/>
					<DialogFooter>
						{isOwner && (
							<Button
								variant="destructive"
								onPress={handleDeleteConfirm}
								disabled={isPending}
							>
								<Text>Usuń</Text>
							</Button>
						)}
						<Button
							variant="outline"
							onPress={() => {
								setName(list.name);
								setIsManageOpen(false);
							}}
							disabled={isPending}
						>
							<Text>Anuluj</Text>
						</Button>
						<Button
							onPress={handleUpdate}
							disabled={!name.trim() || name.trim() === list.name || isPending}
						>
							<Text>{isUpdating ? "Zapisywanie..." : "Zapisz"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Usuń listę</DialogTitle>
						<DialogDescription>
							Czy na pewno chcesz usunąć listę "{list.name}"? Ta operacja jest
							nieodwracalna.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onPress={() => setIsDeleteConfirmOpen(false)}
							disabled={isDeleting}
						>
							<Text>Anuluj</Text>
						</Button>
						<Button
							variant="destructive"
							onPress={handleDelete}
							disabled={isDeleting}
						>
							<Text>{isDeleting ? "Usuwanie..." : "Usuń"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
