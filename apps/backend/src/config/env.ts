import { type BackendEnv, backendEnvSchema } from "./env.schema";

let env: BackendEnv;

export function getEnv(): BackendEnv {
	if (!env) {
		env = backendEnvSchema.parse(process.env);
	}
	return env;
}
