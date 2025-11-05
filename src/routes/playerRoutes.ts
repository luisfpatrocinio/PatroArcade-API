import { Router } from "express";
import {
  createNewPlayer,
  getAllPlayersData,
  getPlayerAllSaves,
  getPlayerData,
  getMyPlayerData,
} from "../controllers/playerController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/create", createNewPlayer);
router.get("/", getAllPlayersData);
router.get("/:playerId", getPlayerData);

// Player protected routes
router.get("/me", authMiddleware, getMyPlayerData);
router.get("/me/saves", getPlayerAllSaves);

// Admin protected route
router.get("/:playerId/saves", getPlayerAllSaves);

export { router as playerRoutes };
