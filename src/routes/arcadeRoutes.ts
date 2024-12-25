import { Router } from "express";
import { fetchArcadeInfoById } from "../controllers/arcadeController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/:arcadeId", fetchArcadeInfoById);

// Exportar o router usando um alias
export { router as arcadeRoutes };
