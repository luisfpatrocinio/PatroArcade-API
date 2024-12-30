import { Router } from "express";
import {
  disconnectArcadePlayersRequest,
  logout,
} from "../controllers/logoutController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.post("/", logout);
router.post("/arcade/:arcadeId", disconnectArcadePlayersRequest);

// Exportar o router usando um alias
export { router as logoutRoutes };
