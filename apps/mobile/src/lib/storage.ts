import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const THEME_KEY = "theme";

export async function getAccessToken(): Promise<string | null> {
	try {
		return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
	} catch (error) {
		console.error("Error getting access token:", error);
		return null;
	}
}

export async function getRefreshToken(): Promise<string | null> {
	try {
		return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
	} catch (error) {
		console.error("Error getting refresh token:", error);
		return null;
	}
}

export async function setTokens(
	accessToken: string,
	refreshToken: string,
): Promise<void> {
	try {
		await Promise.all([
			SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
			SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
		]);
	} catch (error) {
		console.error("Error setting tokens:", error);
		throw error;
	}
}

export async function clearTokens(): Promise<void> {
	try {
		await Promise.all([
			SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
			SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
		]);
	} catch (error) {
		console.error("Error clearing tokens:", error);
		throw error;
	}
}

export async function getStoredTokens(): Promise<{
	accessToken: string | null;
	refreshToken: string | null;
}> {
	try {
		const [accessToken, refreshToken] = await Promise.all([
			getAccessToken(),
			getRefreshToken(),
		]);
		return { accessToken, refreshToken };
	} catch (error) {
		console.error("Error getting stored tokens:", error);
		return { accessToken: null, refreshToken: null };
	}
}

export type Theme = "light" | "dark";

export async function getTheme(): Promise<Theme> {
	try {
		const theme = await SecureStore.getItemAsync(THEME_KEY);
		return (theme as Theme) || "light";
	} catch (error) {
		console.error("Error getting theme:", error);
		return "light";
	}
}

export async function setTheme(theme: Theme): Promise<void> {
	try {
		await SecureStore.setItemAsync(THEME_KEY, theme);
	} catch (error) {
		console.error("Error setting theme:", error);
		throw error;
	}
}
