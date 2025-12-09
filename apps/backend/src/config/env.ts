import { type BackendEnv, backendEnvSchema } from "@ls/shared/config";

let env: BackendEnv;

export function getEnv(): BackendEnv {
	if (!env) {
		env = backendEnvSchema.parse(process.env);
	}
	return env;
}
