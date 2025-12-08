import { Hono } from "hono";
import {
	login,
	logout,
	me,
	refresh,
	register,
} from "../controllers/auth.controller";

const authRoutes = new Hono();

authRoutes.post("/register", ...register);
authRoutes.post("/login", ...login);
authRoutes.post("/refresh", ...refresh);
authRoutes.post("/logout", ...logout);
authRoutes.get("/me", ...me);

export default authRoutes;
