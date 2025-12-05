import { Hono } from "hono";
import {
	getListSharesController,
	removeShareController,
	shareListController,
} from "../controllers/shares.controller";

const sharesRoutes = new Hono();

sharesRoutes.post("/:id/share", ...shareListController);
sharesRoutes.delete("/:id/share/:userId", ...removeShareController);
sharesRoutes.get("/:id/shares", ...getListSharesController);

export default sharesRoutes;
