import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";

const sizeClasses = {
	sm: "size-6",
	md: "size-8",
};

const textClasses = {
	sm: "text-xs",
	md: "text-sm",
};

function getInitials(name: string): string {
	if (!name) {
		return "?";
	}

	const words = name.trim().split(/\s+/);
	const firstWord = words[0];
	const lastWord = words[words.length - 1];

	if (!firstWord) {
		return "?";
	}

	if (words.length === 1) {
		return firstWord.charAt(0).toUpperCase();
	}

	if (!lastWord) {
		return firstWord.charAt(0).toUpperCase();
	}

	const firstInitial = firstWord.charAt(0).toUpperCase();
	const lastInitial = lastWord.charAt(0).toUpperCase();

	return `${firstInitial}${lastInitial}`;
}

interface UserAvatarProps {
	name: string;
	size?: "sm" | "md";
	className?: string;
}

export function UserAvatar(props: UserAvatarProps) {
	const { name, size = "md", className } = props;

	const initials = getInitials(name);

	const sizeClass = sizeClasses[size];
	const textClass = textClasses[size];

	return (
		<Avatar className={`${sizeClass} ${className}`} alt={name}>
			<AvatarFallback>
				<Text
					className={`${textClass} font-medium text-muted-foreground text-center`}
				>
					{initials}
				</Text>
			</AvatarFallback>
		</Avatar>
	);
}
