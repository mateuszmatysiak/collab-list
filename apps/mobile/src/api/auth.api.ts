import type {
	LoginRequest,
	RefreshTokenRequest,
	RegisterRequest,
} from "@ls/shared/validators";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./client";

export const useLogin = () => {
	return useMutation({
		mutationFn: (data: LoginRequest) =>
			apiClient.post("/api/auth/login", data).then((res) => res.data),
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: (data: RegisterRequest) =>
			apiClient.post("/api/auth/register", data).then((res) => res.data),
	});
};

export const useRefresh = () => {
	return useMutation({
		mutationFn: (data: RefreshTokenRequest) =>
			apiClient.post("/api/auth/refresh", data).then((res) => res.data),
	});
};

export const useLogout = () => {
	return useMutation({
		mutationFn: (data: RefreshTokenRequest) =>
			apiClient.post("/api/auth/logout", data).then((res) => res.data),
	});
};

export const useMe = () => {
	return useMutation({
		mutationFn: () => apiClient.get("/api/auth/me").then((res) => res.data),
	});
};
