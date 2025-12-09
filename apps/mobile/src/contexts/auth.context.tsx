import type { LoginRequest, RegisterRequest } from "@ls/shared/validators";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext } from "react";
import { useLogin, useLogout, useMe, useRegister } from "@/api/auth.api";
import { clearTokens, getRefreshToken, setTokens } from "@/lib/storage";

interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const loginMutation = useLogin();
	const registerMutation = useRegister();
	const logoutMutation = useLogout();
	const queryClient = useQueryClient();

	const { data: meData, isLoading: isMeLoading, refetch } = useMe();

	const login = useCallback(
		async (email: string, password: string) => {
			const data: LoginRequest = { email, password };
			const response = await loginMutation.mutateAsync(data);

			await setTokens(response.accessToken, response.refreshToken);
			await refetch();
		},
		[loginMutation, refetch],
	);

	const register = useCallback(
		async (name: string, email: string, password: string) => {
			const data: RegisterRequest = { name, email, password };
			const response = await registerMutation.mutateAsync(data);

			await setTokens(response.accessToken, response.refreshToken);
			await refetch();
		},
		[registerMutation, refetch],
	);

	const logout = useCallback(async () => {
		try {
			const refreshToken = await getRefreshToken();
			if (refreshToken) {
				await logoutMutation.mutateAsync({ refreshToken });
			}
		} catch (_error) {
			// Ignore logout errors
		} finally {
			await clearTokens();
			queryClient.clear();
		}
	}, [logoutMutation, queryClient]);

	const refetchUser = useCallback(async () => {
		await refetch();
	}, [refetch]);

	const value: AuthContextType = {
		user: meData?.user ?? null,
		isLoading: isMeLoading,
		isAuthenticated: meData?.user != null,
		login,
		register,
		logout,
		refetchUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
