import { type MobileEnv, mobileEnvSchema } from "./env.schema";

let env: MobileEnv;

export function getEnv(): MobileEnv {
	if (!env) {
		env = mobileEnvSchema.parse(process.env);
	}
	return env;
}
