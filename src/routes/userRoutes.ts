import { Router } from "express";
import { GetAllUsers } from "../controllers/userController";

const router = Router();

router.get("/", GetAllUsers);

export default router;
