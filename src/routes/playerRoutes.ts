import { Router } from "express";
import {
  GetAllPlayersData,
  GetPlayerAllScores,
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
router.get("/me/scores", authMiddleware, GetPlayerAllScores);

// Public Route
router.get("/:playerId/scores", GetPlayerAllScores);

export { router as playerRoutes };
