import { Router } from "express";
import { registerUser } from "../controllers/registerController";

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.post("/", registerUser);

// Exportar o router usando um alias
export { router as registerRoutes };
