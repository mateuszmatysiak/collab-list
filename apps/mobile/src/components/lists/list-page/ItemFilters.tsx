import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export type ItemFilter = "all" | "completed" | "incomplete";

const FILTER_ITEMS: { value: ItemFilter; label: string }[] = [
	{ value: "all", label: "Wszystkie statusy" },
	{ value: "completed", label: "Ukończone" },
	{ value: "incomplete", label: "Nieukończone" },
];

interface ItemFiltersProps {
	filter: ItemFilter;
	onFilterChange: (filter: ItemFilter) => void;
}

export function ItemFilters(props: ItemFiltersProps) {
	const { filter, onFilterChange } = props;

	return (
		<View className="px-6 pb-4">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-2"
			>
				{FILTER_ITEMS.map((filterItem) => (
					<Button
						key={filterItem.value}
						variant={filter === filterItem.value ? "default" : "outline"}
						size="sm"
						onPress={() => onFilterChange(filterItem.value)}
					>
						<Text>{filterItem.label}</Text>
					</Button>
				))}
			</ScrollView>
		</View>
	);
}
