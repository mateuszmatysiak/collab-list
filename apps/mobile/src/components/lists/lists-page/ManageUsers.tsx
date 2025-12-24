import type { ListWithDetails } from "@collab-list/shared/types";
import { Eye, Plus } from "lucide-react-native";
import { useState } from "react";
import { type GestureResponderEvent, Pressable, View } from "react-native";
import { UserAvatar } from "@/components/lists/shared/UserAvatar";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { useIsListOwner } from "@/hooks/useIsListOwner";
import { cn } from "@/lib/utils";
import { ManageUsersDialog } from "./ManageUsersDialog";

const MAX_VISIBLE_AVATARS = 3;

interface ManageUsersProps {
	list: ListWithDetails;
}

export function ManageUsers(props: ManageUsersProps) {
	const { list } = props;

	const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);

	const isOwner = useIsListOwner(list);
	const visibleShares = list.shares.slice(0, MAX_VISIBLE_AVATARS);
	const hasShares = list.shares.length > 0;

	function handleManageUsers(e: GestureResponderEvent) {
		e.stopPropagation();
		setIsManageUsersOpen(true);
	}

	return (
		<>
			<View className="flex-row items-center">
				{visibleShares.map((share, index) => (
					<View
						key={share.userId}
						className={cn(index === 0 ? "ml-0" : "-ml-3")}
					>
						<UserAvatar
							name={share.userName}
							className="border-2 border-background"
						/>
					</View>
				))}
				<Pressable
					onPress={handleManageUsers}
					className={cn(hasShares ? "-ml-3" : "ml-0")}
					hitSlop={8}
				>
					<Avatar
						className="size-8 border-2 border-background"
						alt="Zarządzaj użytkownikami"
					>
						<AvatarFallback>
							<Icon
								as={isOwner ? Plus : Eye}
								className="text-muted-foreground"
								size={14}
							/>
						</AvatarFallback>
					</Avatar>
				</Pressable>
			</View>

			<ManageUsersDialog
				list={list}
				open={isManageUsersOpen}
				onOpenChange={setIsManageUsersOpen}
			/>
		</>
	);
}
