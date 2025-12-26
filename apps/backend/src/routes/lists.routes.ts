import { Hono } from "hono";
import {
	createLocalCategoryController,
	deleteLocalCategoryController,
	getListCategoriesController,
	importLocalToOwnerController,
	saveLocalToUserController,
} from "../controllers/categories.controller";
import {
	createListController,
	deleteListController,
	getList,
	getLists,
	updateListController,
} from "../controllers/lists.controller";

const listsRoutes = new Hono();

listsRoutes.get("/", ...getLists);
listsRoutes.get("/:id", ...getList);
listsRoutes.post("/", ...createListController);
listsRoutes.patch("/:id", ...updateListController);
listsRoutes.delete("/:id", ...deleteListController);

listsRoutes.get("/:listId/categories", ...getListCategoriesController);
listsRoutes.post("/:listId/categories/local", ...createLocalCategoryController);
listsRoutes.post(
	"/:listId/categories/local/:categoryId/save-to-user",
	...saveLocalToUserController,
);
listsRoutes.post(
	"/:listId/categories/local/:categoryId/import-to-owner",
	...importLocalToOwnerController,
);
listsRoutes.delete(
	"/:listId/categories/local/:categoryId",
	...deleteLocalCategoryController,
);

export default listsRoutes;
