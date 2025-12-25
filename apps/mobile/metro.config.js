const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver = {
	...config.resolver,
	alias: {
		"@": path.resolve(__dirname, "src"),
		"@collab-list/shared": path.resolve(__dirname, "../../packages/shared/src"),
	},
};

module.exports = withNativeWind(config, { input: "./global.css" });
