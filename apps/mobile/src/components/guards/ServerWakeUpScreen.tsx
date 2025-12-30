import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { PulsingAppIcon } from "./PulsingAppIcon";

interface ServerWakeUpScreenProps {
	onRetry?: () => void;
	error?: boolean;
}

export function ServerWakeUpScreen(props: ServerWakeUpScreenProps) {
	const { onRetry, error } = props;

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-background px-6">
				<View className="mb-6">
					<PulsingAppIcon pulsing={false} />
				</View>
				<Text variant="h3" className="mb-2 text-center">
					Błąd połączenia
				</Text>
				<Text variant="muted" className="mb-6 text-center">
					Nie udało się połączyć z serwerem.
				</Text>
				{onRetry && (
					<Button onPress={onRetry} variant="default">
						Spróbuj ponownie
					</Button>
				)}
			</View>
		);
	}

	return (
		<View className="flex-1 items-center justify-center bg-background px-6">
			<View className="mb-6">
				<PulsingAppIcon />
			</View>
			<ActivityIndicator size="large" className="mb-6" />
			<Text variant="h3" className="mb-2 text-center">
				Budzenie serwera
			</Text>
			<Text variant="muted" className="mb-1 text-center">
				Serwer się budzi, proszę czekać.
			</Text>
			<Text variant="muted" className="text-center">
				Może to zająć około minutę.
			</Text>
		</View>
	);
}
