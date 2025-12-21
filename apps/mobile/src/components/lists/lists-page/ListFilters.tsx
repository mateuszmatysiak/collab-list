import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import type { ListFilter } from "./ListsContent";

const FILTERS: { value: ListFilter; label: string }[] = [
	{ value: "all", label: "Wszystkie" },
	{ value: "mine", label: "Moje" },
	{ value: "shared", label: "Udostępnione" },
];

interface ListFiltersProps {
	filter: ListFilter;
	onFilterChange: (filter: ListFilter) => void;
}

export function ListFilters(props: ListFiltersProps) {
	const { filter, onFilterChange } = props;

	return (
		<View className="px-6 pb-4">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-2"
			>
				{FILTERS.map((f) => (
					<Button
						key={f.value}
						variant={filter === f.value ? "default" : "outline"}
						size="sm"
						onPress={() => onFilterChange(f.value)}
					>
						<Text>{f.label}</Text>
					</Button>
				))}
			</ScrollView>
		</View>
	);
}
