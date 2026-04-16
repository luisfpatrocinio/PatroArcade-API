import { Router } from "express";
import {
  GetAllPlayersData,
  GetPlayerAllSaves,
  GetPlayerData,
  GetMyPlayerData,
} from "../controllers/playerController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes
// router.post("/create", createNewPlayer); <-- ROTA REMOVIDA
router.get("/", GetAllPlayersData);

// Player protected routes
router.get("/me", authMiddleware, GetMyPlayerData);
router.get("/:playerId", GetPlayerData); // Esta é pública agora
router.get("/me/saves", authMiddleware, GetPlayerAllSaves);

// Public Route
router.get("/:playerId/saves", GetPlayerAllSaves);

export { router as playerRoutes };
