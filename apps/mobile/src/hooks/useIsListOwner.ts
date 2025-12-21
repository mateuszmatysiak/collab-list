import type { ListWithDetails } from "@collab-list/shared/types";
import { useAuth } from "@/contexts/auth.context";

export function useIsListOwner(
	list: ListWithDetails | { authorId: string },
): boolean {
	const { user } = useAuth();
	return user?.id === list.authorId;
}
