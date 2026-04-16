import { Router } from "express";
import { ValidateSchema } from "../middleware/validateSchema";
import { ScoreSchema } from "../validators/scoreValidator";
import { SubmitScore } from "../controllers/scoreController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Rota de Jogador (Apenas envia pontuação)
router.post(
  "/:gameId",
  authMiddleware,
  ValidateSchema(ScoreSchema),
  SubmitScore
);

export { router as scoreRoutes };
