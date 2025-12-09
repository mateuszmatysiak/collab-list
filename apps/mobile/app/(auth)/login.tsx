import type { LoginRequest } from "@collab-list/shared/validators";
import { loginSchema } from "@collab-list/shared/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/contexts/auth.context";
import type { ApiErrorResponse } from "@/types/api";

export default function LoginScreen() {
	const { login } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginRequest>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginRequest) => {
		setError(null);
		setIsLoading(true);

		try {
			await login(data.email, data.password);
			router.replace("/(tabs)");
		} catch (err) {
			const axiosError = err as AxiosError<ApiErrorResponse>;

			if (axiosError.response) {
				setError(
					axiosError.response.data?.error?.message ||
						`Błąd serwera: ${axiosError.response.status}`,
				);
			} else if (axiosError.request) {
				setError("Nie można połączyć się z serwerem. Sprawdź połączenie.");
			} else {
				setError(axiosError.message || "Nieznany błąd");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 justify-center px-6">
				<View className="gap-6">
					<View className="gap-2">
						<Text className="text-3xl font-bold">Zaloguj się</Text>
						<Text className="text-muted-foreground">
							Wprowadź swoje dane, aby się zalogować
						</Text>
					</View>

					{error && (
						<View className="rounded-md bg-destructive/10 p-3">
							<Text className="text-destructive">{error}</Text>
						</View>
					)}

					<View className="gap-4">
						<View className="gap-2">
							<Label nativeID="email">Email</Label>
							<Controller
								control={control}
								name="email"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="jan@example.com"
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										keyboardType="email-address"
										autoCapitalize="none"
										autoComplete="email"
										accessibilityLabel="Email"
										accessibilityHint="Wprowadź swój adres email"
										error={!!errors.email}
									/>
								)}
							/>
							{errors.email && (
								<Text className="text-sm text-destructive">
									{errors.email.message}
								</Text>
							)}
						</View>

						<View className="gap-2">
							<Label nativeID="password">Hasło</Label>
							<Controller
								control={control}
								name="password"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Hasło"
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										secureTextEntry
										autoCapitalize="none"
										autoComplete="password"
										accessibilityLabel="Hasło"
										accessibilityHint="Wprowadź swoje hasło"
										error={!!errors.password}
									/>
								)}
							/>
							{errors.password && (
								<Text className="text-sm text-destructive">
									{errors.password.message}
								</Text>
							)}
						</View>

						<Button
							onPress={handleSubmit(onSubmit)}
							disabled={isLoading}
							className="mt-4"
						>
							<Text>{isLoading ? "Logowanie..." : "Zaloguj się"}</Text>
						</Button>

						<View className="flex-row justify-center gap-1">
							<Text className="text-muted-foreground">Nie masz konta? </Text>
							<Text
								className="text-primary font-medium"
								onPress={() => router.push("/(auth)/register")}
							>
								Zarejestruj się
							</Text>
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}
