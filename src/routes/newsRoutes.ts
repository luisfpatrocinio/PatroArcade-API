import { Router } from "express";
import { GetLatestNews } from "../controllers/newsController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/", GetLatestNews);

// Exportar o router usando um alias
export { router as newsRoutes };
