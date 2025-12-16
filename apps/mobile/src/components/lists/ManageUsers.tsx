import type { ListWithDetails } from "@collab-list/shared/types";
import { MoreHorizontal, Plus } from "lucide-react-native";
import { useState } from "react";
import { type GestureResponderEvent, Pressable, View } from "react-native";
import { ManageUsersDialog } from "@/components/lists/ManageUsersDialog";
import { UserAvatar } from "@/components/lists/UserAvatar";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/contexts/auth.context";

const MAX_VISIBLE_AVATARS = 3;

interface ManageUsersProps {
	list: ListWithDetails;
}

export function ManageUsers(props: ManageUsersProps) {
	const { list } = props;

	const { user } = useAuth();

	const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);

	const isOwner = user?.id === list.authorId;
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
						style={{ marginLeft: index === 0 ? 0 : -12 }}
					>
						<UserAvatar
							name={share.userName}
							size="md"
							className="border-2 border-background"
						/>
					</View>
				))}
				<Pressable
					onPress={handleManageUsers}
					style={{ marginLeft: hasShares ? -12 : 0 }}
					hitSlop={8}
				>
					<Avatar
						className="size-8 border-2 border-background"
						alt="Zarządzaj użytkownikami"
					>
						<AvatarFallback>
							<Icon
								as={isOwner ? Plus : MoreHorizontal}
								className="text-muted-foreground"
								size={16}
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
