import { Router } from "express";
import { getPlayerSaveData, getSaveDatas } from "../controllers/saveController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/:playerId/:gameId", getPlayerSaveData);

// Rota para obter todos os dados salvos
router.get("/", getSaveDatas);

// Exportar o router usando um alias
export { router as saveRoutes };
