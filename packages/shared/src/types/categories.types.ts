export interface Category {
	id: string;
	name: string;
	icon: string;
	createdAt: Date;
}

export interface CategoryItem {
	id: string;
	categoryId: string;
	name: string;
	createdAt: Date;
}

export interface CategoryWithItems extends Category {
	items: CategoryItem[];
	itemsCount: number;
}

export interface CategoryItemWithCategory extends CategoryItem {
	categoryName: string;
	categoryIcon: string;
}
