import "./types/hono";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { getEnv } from "./config/env";
import authRoutes from "./routes/auth.routes";
import categoriesRoutes from "./routes/categories.routes";
import itemsRoutes from "./routes/items.routes";
import listsRoutes from "./routes/lists.routes";
import sharesRoutes from "./routes/shares.routes";
import { extractErrorMessage, isAppError } from "./utils/errors";

const app = new Hono();

app.use(
	"*",
	cors({
		origin: (origin) => {
			if (!origin) {
				return origin;
			}

			if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
				return origin;
			}

			if (origin.includes("exp://") || origin.includes("expo://")) {
				return origin;
			}

			return null;
		},
		credentials: true,
		allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	}),
);

app.onError((err, c) => {
	if (isAppError(err)) {
		const statusCode = (
			err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500
		) as ContentfulStatusCode;

		return c.json(
			{
				error: {
					message: err.message,
					code: err.code || "APP_ERROR",
				},
			},
			statusCode,
		);
	}

	const errorMessage = extractErrorMessage(err);

	return c.json(
		{
			error: {
				message: errorMessage,
				code: "INTERNAL_ERROR",
			},
		},
		500,
	);
});

app.get("/health", (c) => {
	return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.route("/api/auth", authRoutes);
app.route("/api/categories", categoriesRoutes);
app.route("/api/lists", listsRoutes);
app.route("/api/lists", itemsRoutes);
app.route("/api/lists", sharesRoutes);

app.notFound((c) => {
	return c.json({ error: { message: "Not found", code: "NOT_FOUND" } }, 404);
});

const port = getEnv().PORT;

console.log(`Server starting on port ${port}...`);
console.log(`Environment: ${getEnv().NODE_ENV}`);

const server = serve(
	{
		fetch: app.fetch,
		port: Number(port),
		hostname: "0.0.0.0",
	},
	() => {
		console.log(`Server is running on http://0.0.0.0:${Number(port)}`);
		console.log(`Local: http://localhost:${Number(port)}`);
	},
);

const shutdown = () => {
	console.log("\nShutting down server...");
	server.close(() => {
		console.log("Server closed");
		process.exit(0);
	});
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
