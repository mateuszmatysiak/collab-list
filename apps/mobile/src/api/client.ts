import axios from "axios";
import { getEnv } from "@/config/env";
import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	setTokens,
} from "@/lib/storage";

export const apiClient = axios.create({
	baseURL: getEnv().EXPO_PUBLIC_API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
	async (config) => {
		const accessToken = await getAccessToken();
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = await getRefreshToken();

				if (!refreshToken) {
					await clearTokens();
					return Promise.reject(error);
				}

				const response = await axios.post(
					`${apiClient.defaults.baseURL}/api/auth/refresh`,
					{ refreshToken },
				);

				const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
					response.data;

				await setTokens(newAccessToken, newRefreshToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return apiClient(originalRequest);
			} catch (refreshError) {
				await clearTokens();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
