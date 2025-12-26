import * as LucideIcons from "lucide-react-native";

type LucideIconsMap = Record<string, LucideIcons.LucideIcon>;

const DEFAULT_ICON = LucideIcons.FolderOpen;

export function getCategoryIcon(
	iconName: string | null,
): LucideIcons.LucideIcon {
	if (!iconName) return DEFAULT_ICON;

	const icons = LucideIcons as unknown as LucideIconsMap;

	return icons[iconName] || DEFAULT_ICON;
}
