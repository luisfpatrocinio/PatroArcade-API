import { Router } from "express";
import { GetGameLeaderboardRequest } from "../controllers/leaderboardController";
import { ValidateSchema } from "../middleware/validateSchema";
import { LeaderboardParamSchema } from "../validators/leaderboardValidator";

// Criar uma instância do Router
const router = Router();

// Rota para obter o leaderboards de um jogo específico.
router.get("/:gameId", ValidateSchema(LeaderboardParamSchema), GetGameLeaderboardRequest);

// Exportar o router usando um alias
export { router as leaderboardRoutes };
