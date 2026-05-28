import { Router } from "express";
import { GetAllGamesData, GetGameDatabyGameId, CreateGame } from "../controllers/gameController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de todos os jogos
router.get("/", GetAllGamesData);

router.get("/:gameId", GetGameDatabyGameId);

router.post("/", authMiddleware, adminAuthMiddleware, CreateGame);

// Exportar o router usando um alias
export { router as gamesRoutes };
