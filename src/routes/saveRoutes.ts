import { Router } from "express";
import {
  getPlayerSaveData,
  getSaveDatas,
  savePlayerData,
  updateRichPresence,
} from "../controllers/saveController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/:playerId/:gameId", getPlayerSaveData);

// Rota para obter todos os dados salvos
router.get("/", getSaveDatas);

// Rota para salvar dados de um jogador
router.post("/:playerId/:gameId", savePlayerData);

// Rota para atualizar o Rich Presence Text
router.post("/updateRichPresence/:playerId/:gameId", updateRichPresence);

// Exportar o router usando um alias
export { router as saveRoutes };
