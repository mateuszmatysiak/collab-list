import type { Category } from "@collab-list/shared/types";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";
import { useDeleteCategory } from "@/api/categories.api";
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
import { Text } from "@/components/ui/Text";

interface DeleteCategoryDialogProps {
	category: Category;
}

export function DeleteCategoryDialog(props: DeleteCategoryDialogProps) {
	const { category } = props;
	const [isOpen, setIsOpen] = useState(false);

	const { mutate: deleteCategory, isPending } = useDeleteCategory(category.id);

	function handleDelete() {
		deleteCategory(undefined, {
			onSuccess: () => {
				setIsOpen(false);
				router.back();
			},
			onError: () => {
				Alert.alert(
					"Błąd",
					"Nie udało się usunąć kategorii. Spróbuj ponownie.",
				);
			},
		});
	}

	return (
		<>
			<Button variant="destructive" size="icon" onPress={() => setIsOpen(true)}>
				<Icon as={Trash2} className="text-white" size={18} />
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Usuń kategorię</DialogTitle>
						<DialogDescription>
							Czy na pewno chcesz usunąć kategorię "{category.name}"? Wszystkie
							elementy w tej kategorii zostaną również usunięte. Tej operacji
							nie można cofnąć.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onPress={() => setIsOpen(false)}
							disabled={isPending}
						>
							<Text>Anuluj</Text>
						</Button>
						<Button
							variant="destructive"
							onPress={handleDelete}
							disabled={isPending}
						>
							<Text>{isPending ? "Usuwanie..." : "Usuń"}</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
