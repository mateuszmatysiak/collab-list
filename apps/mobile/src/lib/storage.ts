import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

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
