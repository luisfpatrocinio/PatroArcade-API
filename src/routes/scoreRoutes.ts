import { Router } from "express";
import { ValidateSchema } from "../middleware/validateSchema";
import { ScoreSchema } from "../validators/scoreValidator";
import { SubmitScore } from "../controllers/scoreController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /score/{gameId}:
 *   post:
 *     summary: "Submete uma nova pontuação ou status de atividade para um Arcade"
 *     description: "Se a pontuação for maior que a do recorde atual, ela atualiza. O rich presence sempre é atualizado."
 *     tags: [Score]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do jogo na plataforma"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - sessionTimeInSeconds
 *             properties:
 *               score:
 *                 type: integer
 *                 description: "Pontuação atingida (deve ser maior ou igual a 0)."
 *                 example: 500
 *               sessionTimeInSeconds:
 *                 type: integer
 *                 description: "Tempo gasto na sessão para validação Anti-Cheat"
 *                 example: 60
 *               richPresenceText:
 *                 type: string
 *                 maxLength: 100
 *                 description: "Texto de atividade para amigos verem"
 *                 example: "Farming xp e farmando patro moedas"
 *     responses:
 *       200:
 *         description: "High Score e Presença de rede computados/atualizados."
 *       201:
 *         description: "Primeiro registro inserido com sucesso."
 *       400:
 *         description: "Bloqueado pelo Shield Anti-Cheat (Score excessivo / Payload Invalido)."
 *       401:
 *         description: "Token Ausente ou Inválido."
 */
router.post(
  "/:gameId",
  authMiddleware,
  ValidateSchema(ScoreSchema),
  SubmitScore
);

export { router as scoreRoutes };
