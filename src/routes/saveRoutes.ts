import { Router } from "express";
import { ValidateSchema } from "../middleware/validateSchema";
import { SaveDataSchema, RichPresenceSchema } from "../validators/saveValidator";
import {
  GetPlayerSaveData,
  GetSaveDatas,
  SavePlayerData,
  UpdateRichPresence,
} from "../controllers/saveController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// --- Rotas do Jogador (Godot) ---
router.get("/me/:gameId", authMiddleware, GetPlayerSaveData);

// Adicionar validação para o 'body'
router.post(
  "/me/:gameId",
  authMiddleware, // A rota de save DEVE ser protegida
    ValidateSchema(SaveDataSchema),
  SavePlayerData
);

router.post(
  "/me/UpdateRichPresence/:gameId",
  authMiddleware, // A rota de rich presence também
    ValidateSchema(RichPresenceSchema),
  UpdateRichPresence
);

// --- Rotas do Admin (Para o Webserver) ---
router.get("/", authMiddleware, adminAuthMiddleware, GetSaveDatas);
router.get(
  "/:playerId/:gameId",
  authMiddleware,
  adminAuthMiddleware,
  GetPlayerSaveData
);

export { router as saveRoutes };
