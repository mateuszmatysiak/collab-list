import { type BackendEnv, backendEnvSchema } from "@collab-list/shared/config";

let env: BackendEnv;

export function getEnv(): BackendEnv {
	if (!env) {
		env = backendEnvSchema.parse(process.env);
	}
	return env;
}
