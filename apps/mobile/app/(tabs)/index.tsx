import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/contexts/auth.context";

export default function MainScreen() {
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
		router.replace("/(auth)/login");
	};

	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 p-6">
				<View className="gap-6">
					<View className="gap-2">
						<Text className="text-3xl font-bold">Witaj!</Text>
						<Text className="text-muted-foreground">
							Jesteś zalogowany jako:
						</Text>
					</View>

					<Card className="p-4">
						<View className="gap-2">
							<View>
								<Text className="text-sm text-muted-foreground">Imię</Text>
								<Text className="text-base font-medium">{user?.name}</Text>
							</View>
							<View>
								<Text className="text-sm text-muted-foreground">Email</Text>
								<Text className="text-base font-medium">{user?.email}</Text>
							</View>
							<View>
								<Text className="text-sm text-muted-foreground">ID</Text>
								<Text className="text-base font-medium">{user?.id}</Text>
							</View>
						</View>
					</Card>

					<Button onPress={handleLogout} variant="default">
						<Text>Wyloguj się</Text>
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
