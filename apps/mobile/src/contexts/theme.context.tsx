import { useColorScheme, vars } from "nativewind";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { View } from "react-native";
import { getTheme, setTheme, type Theme } from "@/lib/storage";
import { colors } from "@/lib/theme";

function createThemeVars(theme: (typeof colors)[keyof typeof colors]) {
	return vars({
		"--background": theme.background,
		"--foreground": theme.foreground,
		"--card": theme.card,
		"--card-foreground": theme.cardForeground,
		"--popover": theme.popover,
		"--popover-foreground": theme.popoverForeground,
		"--primary": theme.primary,
		"--primary-foreground": theme.primaryForeground,
		"--secondary": theme.secondary,
		"--secondary-foreground": theme.secondaryForeground,
		"--muted": theme.muted,
		"--muted-foreground": theme.mutedForeground,
		"--accent": theme.accent,
		"--accent-foreground": theme.accentForeground,
		"--destructive": theme.destructive,
		"--destructive-foreground": theme.destructiveForeground,
		"--border": theme.border,
		"--input": theme.input,
		"--ring": theme.ring,
	});
}

const lightTheme = createThemeVars(colors.light);
const darkTheme = createThemeVars(colors.dark);

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => Promise<void>;
	setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light");
	const [isLoading, setIsLoading] = useState(true);

	const { setColorScheme } = useColorScheme();

	useEffect(() => {
		async function loadTheme() {
			try {
				const savedTheme = await getTheme();
				setThemeState(savedTheme);
				setColorScheme(savedTheme);
			} catch (error) {
				console.error("Error loading theme:", error);
			} finally {
				setIsLoading(false);
			}
		}
		loadTheme();
	}, [setColorScheme]);

	useEffect(() => {
		if (theme && !isLoading) {
			setColorScheme(theme);
		}
	}, [theme, isLoading, setColorScheme]);

	const updateTheme = useCallback(async (newTheme: Theme) => {
		try {
			await setTheme(newTheme);
			setThemeState(newTheme);
		} catch (error) {
			console.error("Error updating theme:", error);
		}
	}, []);

	const toggleTheme = useCallback(async () => {
		const newTheme = theme === "light" ? "dark" : "light";
		await updateTheme(newTheme);
	}, [theme, updateTheme]);

	const value: ThemeContextType = {
		theme,
		toggleTheme,
		setTheme: updateTheme,
	};

	if (isLoading) {
		return (
			<View style={[{ flex: 1 }, lightTheme]} className="bg-background">
				{children}
			</View>
		);
	}

	return (
		<ThemeContext.Provider value={value}>
			<View style={[{ flex: 1 }, theme === "dark" ? darkTheme : lightTheme]}>
				{children}
			</View>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
