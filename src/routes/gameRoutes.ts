import { Router } from "express";
import {
  GetGameDatabyGameId,
  GetAllGamesData,
  CreateGame,
} from "../controllers/gameController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { ValidateSchema } from "../middleware/validateSchema";
import { createGameSchema } from "../validators/gameValidator";

// Criar uma instância do Router
const router = Router();

router.post("/", 
  authMiddleware, 
  adminAuthMiddleware, 
  ValidateSchema(createGameSchema), 
  CreateGame
);

router.get("/", GetAllGamesData);
router.get("/:gameId", GetGameDatabyGameId);

// Exportar o router usando um alias
export { router as gameRoutes };
