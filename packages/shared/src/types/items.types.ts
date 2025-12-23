export interface ListItem {
	id: string;
	listId: string;
	title: string;
	description: string | null;
	isCompleted: boolean;
	categoryId: string | null;
	categoryIcon: string | null;
	position: number;
	createdAt: Date;
}
