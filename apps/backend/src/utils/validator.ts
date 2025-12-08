import { zValidator } from "@hono/zod-validator";
import type { Context } from "hono";
import type { ZodType, z } from "zod";

export function createJsonValidator<T extends ZodType>(schema: T) {
	return zValidator("json", schema);
}

export function getValidatedJson<T extends ZodType>(
	c: Context,
	_schema: T,
): z.infer<T> {
	// biome-ignore lint/suspicious/noExplicitAny: Required for zValidator type compatibility with Zod 4.x
	return (c.req as any).valid("json") as z.infer<T>;
}
