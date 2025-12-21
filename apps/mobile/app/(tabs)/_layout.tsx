import { Tabs } from "expo-router";
import { FolderOpen, ListTodo, UserIcon } from "lucide-react-native";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					paddingTop: 8,
				},
			}}
		>
			<Tabs.Screen
				name="index"
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
			<Tabs.Screen
				name="lists/[id]"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
