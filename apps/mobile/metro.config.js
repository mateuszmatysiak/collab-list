const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders || []), workspaceRoot];
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, "node_modules"),
	path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.alias = {
	"@": path.resolve(projectRoot, "src"),
	"@/assets": path.resolve(projectRoot, "assets"),
	"@collab-list/shared": path.resolve(workspaceRoot, "packages/shared/src"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
