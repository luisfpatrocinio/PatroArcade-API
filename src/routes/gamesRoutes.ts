import { Router } from "express";
import { GetAllGamesData } from "../controllers/gameController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de todos os jogos
router.get("/", GetAllGamesData);

// Exportar o router usando um alias
export { router as gamesRoutes };
