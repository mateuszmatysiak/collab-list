export const queryKeys = {
	auth: ["auth"] as const,
	lists: {
		all: ["lists"] as const,
		detail: (id: string) => ["lists", id] as const,
		items: (listId: string) => ["lists", listId, "items"] as const,
		shares: (listId: string) => ["lists", listId, "shares"] as const,
	},
	categories: {
		all: ["categories"] as const,
	},
};
