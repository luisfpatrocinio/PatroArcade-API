import { Router } from "express";
import { GetGameLeaderboardRequest } from "../controllers/leaderboardController";

// Criar uma instância do Router
const router = Router();

// Rota para obter o leaderboards de um jogo específico.
router.get("/:gameId", GetGameLeaderboardRequest);

// Exportar o router usando um alias
export { router as leaderboardRoutes };
