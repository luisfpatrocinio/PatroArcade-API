import { Router } from "express";
import { GetAllUsers } from "../controllers/userController";

const router = Router();

router.get("/users", GetAllUsers);

export default router;
