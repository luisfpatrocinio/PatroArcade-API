import { Router } from "express";
import {
  DisconnectArcadePlayersRequest,
  Logout,
} from "../controllers/logoutController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.post("/", Logout);
router.post("/arcade/:arcadeId", DisconnectArcadePlayersRequest);

// Exportar o router usando um alias
export { router as logoutRoutes };
