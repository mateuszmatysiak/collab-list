import { Calendar, ListTodo, Mail, Moon, Users } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLists } from "@/api/lists.api";
import { LogoutDialog } from "@/components/auth/LogoutDialog";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/contexts/auth.context";
import { useTheme } from "@/contexts/theme.context";
import { formatDate, getInitials } from "@/lib/utils";

export default function ProfileScreen() {
	const { user } = useAuth();
	const { theme, toggleTheme } = useTheme();

	const { data: lists } = useLists();

	if (!user) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
				<View className="flex-1 items-center justify-center px-6">
					<Text className="text-lg text-muted-foreground">
						Brak danych użytkownika
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const ownedLists = lists?.filter((list) => list.role === "owner") || [];
	const sharedLists = lists?.filter((list) => list.role !== "owner") || [];
	const initials = getInitials(user.name);

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<ScrollView
				className="flex-1"
				contentContainerClassName="px-6 py-8 gap-6"
				showsVerticalScrollIndicator={false}
			>
				<View className="items-center gap-4">
					<Avatar className="size-24" alt={user.name}>
						<AvatarFallback>
							<Text className="text-3xl font-semibold text-muted-foreground">
								{initials}
							</Text>
						</AvatarFallback>
					</Avatar>

					<View className="items-center gap-1">
						<Text className="text-2xl font-bold">{user.name}</Text>
						<View className="flex-row items-center gap-2">
							<Icon as={Mail} className="text-muted-foreground" size={16} />
							<Text className="text-muted-foreground">{user.login}</Text>
						</View>

						<View className="flex-row items-center gap-2">
							<Icon as={Calendar} className="text-muted-foreground" size={16} />
							<Text className="text-sm text-muted-foreground">
								Dołączył: {formatDate(user.createdAt)}
							</Text>
						</View>
					</View>
				</View>

				<View className="gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Statystyki</CardTitle>
						</CardHeader>
						<CardContent className="gap-4">
							<View className="flex-row items-center justify-between">
								<View className="flex-row items-center gap-3">
									<View className="size-10 items-center justify-center rounded-full bg-primary/10">
										<Icon as={ListTodo} className="text-primary" size={20} />
									</View>
									<View>
										<Text className="text-sm text-muted-foreground">
											Moje listy
										</Text>
										<Text className="text-lg font-semibold">
											{ownedLists.length}
										</Text>
									</View>
								</View>
							</View>

							<View className="flex-row items-center justify-between">
								<View className="flex-row items-center gap-3">
									<View className="size-10 items-center justify-center rounded-full bg-secondary">
										<Icon
											as={Users}
											className="text-secondary-foreground"
											size={20}
										/>
									</View>
									<View>
										<Text className="text-sm text-muted-foreground">
											Udostępnione listy
										</Text>
										<Text className="text-lg font-semibold">
											{sharedLists.length}
										</Text>
									</View>
								</View>
							</View>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Ustawienia</CardTitle>
						</CardHeader>
						<CardContent>
							<View className="flex-row items-center justify-between">
								<View className="flex-row items-center gap-3">
									<View className="size-10 items-center justify-center rounded-full bg-primary/10">
										<Icon as={Moon} className="text-primary" size={20} />
									</View>
									<View>
										<Text className="text-sm font-medium">Tryb ciemny</Text>
										<Text className="text-xs text-muted-foreground">
											Włącz ciemny motyw
										</Text>
									</View>
								</View>
								<Switch value={theme === "dark"} onValueChange={toggleTheme} />
							</View>
						</CardContent>
					</Card>

					<View className="items-center pt-2">
						<LogoutDialog variant="button" />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
