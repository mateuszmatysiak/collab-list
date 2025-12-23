import { Tabs } from "expo-router";
import { FolderOpen, ListTodo, UserIcon } from "lucide-react-native";
import { useTheme } from "@/contexts/theme.context";

export default function TabLayout() {
	const { theme } = useTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					paddingTop: 8,
					backgroundColor:
						theme === "dark" ? "rgb(24 24 27)" : "rgb(255 255 255)",
					borderTopColor:
						theme === "dark" ? "rgb(39 39 42)" : "rgb(228 228 231)",
				},
				tabBarActiveTintColor:
					theme === "dark" ? "rgb(250 250 250)" : "rgb(24 24 27)",
				tabBarInactiveTintColor:
					theme === "dark" ? "rgb(161 161 170)" : "rgb(113 113 122)",
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
