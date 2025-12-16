import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ActivityIndicator, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useList } from "@/api/lists.api";
import { ManageListDialog } from "@/components/lists/ManageListDialog";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

export default function ListDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: list, isLoading, isError, refetch } = useList(id);

	function handleBack() {
		router.back();
	}

	if (!id) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-lg font-medium text-destructive">
						Nieprawidłowy identyfikator listy
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-row items-center gap-3 px-4 py-4 border-b border-border">
				<Pressable
					onPress={handleBack}
					className="size-10 items-center justify-center rounded-full active:bg-accent"
				>
					<Icon as={ArrowLeft} className="text-foreground" size={20} />
				</Pressable>
				<Text className="text-lg font-semibold flex-1" numberOfLines={1}>
					{isLoading ? "Ładowanie..." : (list?.name ?? "Lista")}
				</Text>
				{list && <ManageListDialog list={list} />}
			</View>

			<View className="flex-1 p-6">
				{isLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" />
					</View>
				) : isError ? (
					<View className="flex-1 items-center justify-center gap-2">
						<Text className="text-lg font-medium text-destructive">
							Błąd ładowania listy
						</Text>
						<Pressable onPress={() => refetch()}>
							<Text className="text-primary underline">Spróbuj ponownie</Text>
						</Pressable>
					</View>
				) : (
					<View className="gap-4">
						<View className="gap-2">
							<Text className="text-sm text-muted-foreground">Nazwa</Text>
							<Text className="text-base font-medium">{list?.name}</Text>
						</View>
						<View className="gap-2">
							<Text className="text-sm text-muted-foreground">ID</Text>
							<Text className="text-base font-medium">{list?.id}</Text>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}
