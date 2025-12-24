import { Tabs } from "expo-router";
import { FolderOpen, ListTodo, UserIcon } from "lucide-react-native";
import { useTheme } from "@/contexts/theme.context";
import { colors } from "@/lib/theme";

function rgb(color: string): string {
	return `rgb(${color})`;
}

export default function TabLayout() {
	const { theme } = useTheme();
	const themeColors = colors[theme];

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					paddingTop: 8,
					backgroundColor: rgb(themeColors.card),
					borderTopColor: rgb(themeColors.border),
				},
				tabBarActiveTintColor:
					theme === "dark"
						? rgb(themeColors.foreground)
						: rgb(themeColors.primary),
				tabBarInactiveTintColor: rgb(themeColors.mutedForeground),
			}}
		>
			<Tabs.Screen
				name="lists"
				options={{
					title: "Listy",
					tabBarIcon: ({ color, size }) => (
						<ListTodo color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="categories"
				options={{
					title: "Kategorie",
					tabBarIcon: ({ color, size }) => (
						<FolderOpen color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profil",
					tabBarIcon: ({ color, size }) => (
						<UserIcon color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
