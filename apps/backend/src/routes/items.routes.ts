import { Hono } from "hono";
import {
	createItemController,
	deleteItemController,
	updateItemController,
} from "../controllers/items.controller";

const itemsRoutes = new Hono();

itemsRoutes.post("/:listId/items", ...createItemController);
itemsRoutes.patch("/:listId/items/:itemId", ...updateItemController);
itemsRoutes.delete("/:listId/items/:itemId", ...deleteItemController);

export default itemsRoutes;
