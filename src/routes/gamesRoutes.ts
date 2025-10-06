import { Router } from "express";
import { getAllGamesData } from "../controllers/gameController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de todos os jogos
router.get("/", getAllGamesData);

// Exportar o router usando um alias
export { router as gamesRoutes };
