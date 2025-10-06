import { Router } from "express";
import {
  getPlayerSaveData,
  getSaveDatas,
  savePlayerData,
  updateRichPresence,
} from "../controllers/saveController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";

const router = Router();

// --- Rotas do Jogador (Godot) ---
// CORREÇÃO: Adicionada a barra "/" entre "me" e ":gameId".
router.get("/me/:gameId", getPlayerSaveData);
router.post("/me/:gameId", savePlayerData);

// Esta já estava correta, mas mantemos aqui para consistência.
router.post("/me/updateRichPresence/:gameId", updateRichPresence);

// --- Rotas do Admin (Para o Webserver) ---
// A ordem está correta, mas as rotas de jogador precisam estar certas para serem encontradas primeiro.

router.get("/", adminAuthMiddleware, getSaveDatas);
router.get("/:playerId/:gameId", adminAuthMiddleware, getPlayerSaveData);

export { router as saveRoutes };
