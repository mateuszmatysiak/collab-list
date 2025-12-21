import { Hono } from "hono";
import {
	createItemController,
	deleteItemController,
	getItemsController,
	updateItemController,
} from "../controllers/items.controller";

const itemsRoutes = new Hono();

itemsRoutes.get("/:listId/items", ...getItemsController);
itemsRoutes.post("/:listId/items", ...createItemController);
itemsRoutes.patch("/:listId/items/:itemId", ...updateItemController);
itemsRoutes.delete("/:listId/items/:itemId", ...deleteItemController);

export default itemsRoutes;
