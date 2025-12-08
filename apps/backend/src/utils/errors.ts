export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code?: string,
	) {
		super(message);
		this.name = "AppError";
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "ValidationError";
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = "Unauthorized") {
		super(message, 401, "UNAUTHORIZED");
		this.name = "UnauthorizedError";
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = "Forbidden") {
		super(message, 403, "FORBIDDEN");
		this.name = "ForbiddenError";
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = "Resource not found") {
		super(message, 404, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409, "CONFLICT");
		this.name = "ConflictError";
	}
}

export function isAppError(error: unknown): error is AppError {
	return (
		error !== null &&
		typeof error === "object" &&
		"statusCode" in error &&
		typeof (error as Record<string, unknown>).statusCode === "number" &&
		"message" in error &&
		typeof (error as Record<string, unknown>).message === "string"
	);
}

export function extractErrorMessage(err: unknown): string {
	if (err instanceof Error) {
		return err.message || err.toString();
	}

	if (err && typeof err === "object" && "message" in err) {
		const message = (err as Record<string, unknown>).message;
		if (typeof message === "string" && message.trim()) {
			return message;
		}
		if (message != null) {
			return String(message);
		}
	}

	if (err != null) {
		const stringified = String(err);
		if (stringified !== "[object Object]") {
			return stringified;
		}
	}

	return "Internal server error";
}
