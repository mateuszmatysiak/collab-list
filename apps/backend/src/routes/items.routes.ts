import { Hono } from "hono";
import {
	createItemController,
	deleteItemController,
	getItemsController,
	reorderItemsController,
	updateItemController,
} from "../controllers/items.controller";

const itemsRoutes = new Hono();

itemsRoutes.get("/:listId/items", ...getItemsController);
itemsRoutes.post("/:listId/items", ...createItemController);
itemsRoutes.put("/:listId/items/reorder", ...reorderItemsController);
itemsRoutes.patch("/:listId/items/:itemId", ...updateItemController);
itemsRoutes.delete("/:listId/items/:itemId", ...deleteItemController);

export default itemsRoutes;
