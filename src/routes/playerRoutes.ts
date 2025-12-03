import { Router } from "express";
import {
  getAllPlayersData,
  getPlayerAllSaves,
  getPlayerData,
  getMyPlayerData,
} from "../controllers/playerController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes
// router.post("/create", createNewPlayer); <-- ROTA REMOVIDA
router.get("/", getAllPlayersData);

// Player protected routes
router.get("/me", authMiddleware, getMyPlayerData);
router.get("/:playerId", getPlayerData); // Esta é pública agora
router.get("/me/saves", authMiddleware, getPlayerAllSaves);

// Public Route
router.get("/:playerId/saves", getPlayerAllSaves);

export { router as playerRoutes };
