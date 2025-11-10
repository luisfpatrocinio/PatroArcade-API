import { Router } from "express";
import { body } from "express-validator";
import {
  getPlayerSaveData,
  getSaveDatas,
  savePlayerData,
  updateRichPresence,
} from "../controllers/saveController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// --- Rotas do Jogador (Godot) ---
router.get("/me/:gameId", authMiddleware, getPlayerSaveData);

// Adicionar validação para o 'body'
router.post(
  "/me/:gameId",
  authMiddleware, // A rota de save DEVE ser protegida
  [
    // Verifica se o 'body' (que é o 'data' do save) é um objeto JSON
    body().isObject().withMessage("Os dados de save devem ser um objeto JSON."),
    // Exemplo de validação mais profunda (opcional, mas bom):
    // body("highestScore")
    //   .optional() // O campo pode não existir
    //   .isNumeric()
    //   .withMessage("highestScore deve ser um número."),
  ],
  savePlayerData
);

router.post(
  "/me/updateRichPresence/:gameId",
  authMiddleware, // A rota de rich presence também
  [
    // Validar o richPresenceText
    body("richPresenceText")
      .notEmpty()
      .withMessage("richPresenceText não pode estar vazio.")
      .isString()
      .withMessage("richPresenceText deve ser texto.")
      .trim()
      .escape(),
  ],
  updateRichPresence
);

// --- Rotas do Admin (Para o Webserver) ---
router.get("/", authMiddleware, adminAuthMiddleware, getSaveDatas);
router.get(
  "/:playerId/:gameId",
  authMiddleware,
  adminAuthMiddleware,
  getPlayerSaveData
);

export { router as saveRoutes };
