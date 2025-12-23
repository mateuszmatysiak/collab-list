import * as LucideIcons from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export const POPULAR_ICONS = [
	"ShoppingCart",
	"Milk",
	"Beef",
	"Apple",
	"Carrot",
	"Coffee",
	"Wheat",
	"SprayCan",
	"Candy",
	"Package",
	"Home",
	"Car",
	"Plane",
	"Book",
	"Shirt",
	"Gift",
	"Heart",
	"Star",
	"Briefcase",
	"Wrench",
	"Pill",
	"Baby",
	"Dog",
	"Flower2",
] as const;

interface IconPickerProps {
	selectedIcon: string;
	onSelectIcon: (icon: string) => void;
}

function getIconComponent(iconName: string): LucideIcons.LucideIcon {
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcons.LucideIcon
	>;
	return icons[iconName] || LucideIcons.FolderOpen;
}

export function IconPicker(props: IconPickerProps) {
	const { selectedIcon, onSelectIcon } = props;

	return (
		<View className="flex-row flex-wrap gap-2">
			{POPULAR_ICONS.map((iconName) => {
				const IconComponent = getIconComponent(iconName);
				const isSelected = selectedIcon === iconName;

				return (
					<Pressable
						key={iconName}
						onPress={() => onSelectIcon(iconName)}
						className={cn(
							"size-10 items-center justify-center rounded-lg border",
							isSelected
								? "border-primary bg-primary/10"
								: "border-border bg-background",
						)}
					>
						<Icon
							as={IconComponent}
							className={isSelected ? "text-primary" : "text-muted-foreground"}
							size={20}
						/>
					</Pressable>
				);
			})}
		</View>
	);
}
