import { Router } from "express";
import {
  createNewPlayer,
  getAllPlayersData,
  getPlayerAllSaves,
  getPlayerData,
  getMyPlayerData,
} from "../controllers/playerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";

// Criar uma instância do Router
const router = Router();

// --- ROTAS PÚBLICAS ---
router.post("/create", createNewPlayer);
router.get("/", getAllPlayersData);
router.get("/:playerId", getPlayerData);

// --- ROTAS PROTEGIDAS PARA JOGADORES (Self-service) ---
// Requerem que o usuário esteja logado (usa authMiddleware).
// O jogo Godot usará principalmente estas rotas.
router.get("/me", authMiddleware, getMyPlayerData);
router.get("/me/saves", authMiddleware, getPlayerAllSaves); // Jogador obtendo os PRÓPRIOS saves


// --- ROTA PROTEGIDA PARA ADMINISTRADORES ---
// Requer que o usuário seja um admin logado (usa a cadeia de middlewares).
// Seu webserver usará esta rota.
router.get(
  "/:playerId/saves",
  authMiddleware,       // 2. Primeiro segurança: Garante que há um token válido.
  adminAuthMiddleware,  // 3. Segundo segurança: Garante que o usuário do token é 'admin'.
  getPlayerAllSaves     // 4. Se ambos passarem, a requisição chega ao controller.
);

// Exportar o router usando um alias
export { router as playerRoutes };
