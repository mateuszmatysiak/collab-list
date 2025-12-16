import { Tabs } from "expo-router";
import { Folder, TextAlignStart, UserRound } from "lucide-react-native";

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
						<TextAlignStart color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="categories"
				options={{
					title: "Kategorie",
					tabBarIcon: ({ color, size }) => <Folder color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profil",
					tabBarIcon: ({ color, size }) => (
						<UserRound color={color} size={size} />
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
