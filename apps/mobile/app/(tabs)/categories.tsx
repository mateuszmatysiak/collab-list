import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { CategorySearchInput } from "@/components/categories/CategorySearchInput";
import { CreateCategoryDialog } from "@/components/categories/CreateCategoryDialog";
import { Text } from "@/components/ui/Text";

export default function CategoriesScreen() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="flex-1">
				<View className="px-6 py-4">
					<Text className="text-2xl font-bold">Kategorie</Text>
				</View>

				<View className="px-6 pb-4">
					<CategorySearchInput
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				<CategoryGrid searchQuery={searchQuery} />

				<View className="px-6 pb-6">
					<CreateCategoryDialog />
				</View>
			</View>
		</SafeAreaView>
	);
}
