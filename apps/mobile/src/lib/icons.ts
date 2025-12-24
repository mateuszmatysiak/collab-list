import * as LucideIcons from "lucide-react-native";

export function getCategoryIcon(
	iconName: string | null,
): LucideIcons.LucideIcon | null {
	if (!iconName) return null;
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcons.LucideIcon
	>;
	return icons[iconName] || null;
}

export function getCategoryIconWithFallback(
	iconName: string,
): LucideIcons.LucideIcon {
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcons.LucideIcon
	>;
	return icons[iconName] || LucideIcons.FolderOpen;
}
