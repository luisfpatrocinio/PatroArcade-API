import { Router } from "express";
import { tryToLoginArcade } from "../controllers/loginArcadeController";

// Criar uma instância do Router
const router = Router();

// Essa rota vai tentar logar um usuário no painel de administrador.

// Rota para obter dados de um jogador específico
router.post("/:clientTempId", tryToLoginArcade);

// Exportar o router usando um alias
export { router as arcadeLoginRoutes };
