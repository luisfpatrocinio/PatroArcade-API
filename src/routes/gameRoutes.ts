import { Router } from "express";
import {
  getGameDatabyGameId,
  getGamesData,
} from "../controllers/gameController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/", getGamesData);
router.get("/:gameId", getGameDatabyGameId);

// Exportar o router usando um alias
export { router as gameRoutes };
