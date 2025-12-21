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
		detail: (id: string) => ["categories", id] as const,
		items: (categoryId: string) => ["categories", categoryId, "items"] as const,
		search: (query: string) => ["categories", "search", query] as const,
	},
};
