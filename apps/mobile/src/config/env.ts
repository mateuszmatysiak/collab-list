import { type MobileEnv, mobileEnvSchema } from "@ls/shared/config";

let env: MobileEnv;

export function getEnv(): MobileEnv {
	if (!env) {
		env = mobileEnvSchema.parse(process.env);
	}
	return env;
}
