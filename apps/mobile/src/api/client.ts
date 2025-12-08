import axios from "axios";

export const apiClient = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

// Interceptor dla JWT tokena
apiClient.interceptors.request.use((config) => {
	// TODO: Dodać pobieranie tokena z storage i ustawianie Authorization header
	// const token = await getStoredToken();
	// if (token) {
	//   config.headers.Authorization = `Bearer ${token}`;
	// }
	return config;
});

// Interceptor dla refresh token flow
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// TODO: Implementować refresh token flow
			// try {
			//   const refreshToken = await getStoredRefreshToken();
			//   const response = await axios.post('/api/auth/refresh', { refreshToken });
			//   const { accessToken } = response.data;
			//   await storeToken(accessToken);
			//   originalRequest.headers.Authorization = `Bearer ${accessToken}`;
			//   return apiClient(originalRequest);
			// } catch (refreshError) {
			//   // Wylogować użytkownika
			//   return Promise.reject(refreshError);
			// }
		}

		return Promise.reject(error);
	},
);
