import { Router } from "express";
import {
  GetGameDatabyGameId,
  GetAllGamesData,
} from "../controllers/gameController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/", GetAllGamesData);
router.get("/:gameId", GetGameDatabyGameId);

// Exportar o router usando um alias
export { router as gameRoutes };
