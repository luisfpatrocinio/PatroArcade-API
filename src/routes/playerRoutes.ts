import { Router } from "express";
import {
    createNewPlayer,
    getAllPlayersData,
    getPlayerAllSaves,
    getPlayerData,
    getMyPlayerData,
} from "../controllers/playerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";

const router = Router();

// Public routes
router.post("/create", createNewPlayer);
router.get("/", getAllPlayersData);

// Player protected routes
router.get("/me", authMiddleware, getMyPlayerData);
router.get("/:playerId", getPlayerData);
router.get("/me/saves", authMiddleware, getPlayerAllSaves);

// Admin protected route
router.get(
    "/:playerId/saves",
    authMiddleware,
    adminAuthMiddleware,
    getPlayerAllSaves
);

export { router as playerRoutes };
