import { Router } from "express";
import { createUser, login } from "./user.controller.ts";

const router = Router();

router.post("/register", createUser);
router.post("/login", login);

export default router;
