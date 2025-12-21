import type { Category } from "@collab-list/shared/types";
import { router } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

interface CategoryCardProps {
	category: Category & { itemsCount: number };
	width: number;
}

function getCategoryIcon(iconName: string): LucideIcons.LucideIcon {
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcons.LucideIcon
	>;
	return icons[iconName] || LucideIcons.FolderOpen;
}

export function CategoryCard(props: CategoryCardProps) {
	const { category, width } = props;
	const IconComponent = getCategoryIcon(category.icon);

	function handlePress() {
		router.push(`/(tabs)/categories/${category.id}`);
	}

	return (
		<Pressable
			onPress={handlePress}
			className="m-1"
			style={{ width, aspectRatio: 1 }}
		>
			<View className="flex-1 items-center justify-center rounded-xl bg-card border border-border p-3">
				<View className="size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
					<Icon as={IconComponent} className="text-primary" size={24} />
				</View>
				<Text className="text-sm font-medium text-center" numberOfLines={2}>
					{category.name}
				</Text>
				<Text className="text-xs text-muted-foreground mt-1">
					{category.itemsCount} elem.
				</Text>
			</View>
		</Pressable>
	);
}
