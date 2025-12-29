import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface ErrorFallbackProps {
	error: Error;
	resetError: () => void;
}

function ErrorFallback(props: ErrorFallbackProps) {
	const { error, resetError } = props;

	return (
		<View className="flex-1 items-center justify-center p-6 bg-background">
			<View className="max-w-md w-full gap-4">
				<Text variant="h2" className="text-destructive">
					Coś poszło nie tak
				</Text>
				<Text variant="p" className="text-muted-foreground">
					Wystąpił nieoczekiwany błąd. Możesz spróbować ponownie lub
					zrestartować aplikację.
				</Text>
				{__DEV__ && error && (
					<View className="mt-4 p-4 bg-muted rounded-md">
						<Text variant="small" className="font-mono text-destructive">
							{error.message}
						</Text>
					</View>
				)}
				<View className="mt-4 gap-2">
					<Button onPress={resetError} className="w-full">
						<Text variant="default" className="text-primary-foreground">
							Spróbuj ponownie
						</Text>
					</Button>
				</View>
			</View>
		</View>
	);
}

export { ErrorFallback };
