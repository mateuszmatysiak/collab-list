import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { Alert } from "react-native";
import { useCreateList } from "@/api/lists.api";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

export function CreateListButton() {
	const { mutate: createList, isPending } = useCreateList();

	function handleCreate() {
		createList(
			{ name: "Nowa lista" },
			{
				onSuccess: (data) => {
					router.push(`/(tabs)/lists/${data.list.id}`);
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

	return (
		<Button
			onPress={handleCreate}
			size="lg"
			className="w-full"
			disabled={isPending}
		>
			<Icon as={Plus} className="text-primary-foreground" size={20} />
			<Text>{isPending ? "Tworzenie..." : "Utwórz listę"}</Text>
		</Button>
	);
}
