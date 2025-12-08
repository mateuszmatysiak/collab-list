import { Hono } from "hono";
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

export default listsRoutes;
