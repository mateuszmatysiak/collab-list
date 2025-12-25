import { Hono } from "hono";
import {
	createLocalCategoryController,
	getListCategoriesController,
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

export default listsRoutes;
