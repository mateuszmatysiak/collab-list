import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { cn, getInitials } from "@/lib/utils";

interface UserAvatarProps {
	name: string;
	className?: string;
}

export function UserAvatar(props: UserAvatarProps) {
	const { name, className } = props;

	const initials = getInitials(name);

	return (
		<Avatar className={cn("size-8", className)} alt={name}>
			<AvatarFallback>
				<Text className="text-sm font-medium text-muted-foreground text-center">
					{initials}
				</Text>
			</AvatarFallback>
		</Avatar>
	);
}
