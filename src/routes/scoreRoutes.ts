import { Router } from "express";
import { ValidateSchema } from "../middleware/validateSchema";
import { ScoreSchema, UpdateStatusSchema } from "../validators/scoreValidator";
import { SubmitScore, UpdateStatus } from "../controllers/scoreController";
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

/**
 * @swagger
 * /score/status/{gameId}:
 *   put:
 *     summary: "Atualiza o Rich Presence do jogador sem submeter pontuações."
 *     description: "Pode ser chamado constantemente para atualizar o que o jogador está fazendo, ignorando a lógica de high score (por ex. 'Explorando floresta', 'Na fase do Chefe')."
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
 *               - richPresenceText
 *             properties:
 *               richPresenceText:
 *                 type: string
 *                 maxLength: 100
 *                 description: "O texto descrevendo a atividade"
 *                 example: "Derrotando Opressor da Floresta"
 *     responses:
 *       200:
 *         description: "Status de atividade atualizado com sucesso."
 *       201:
 *         description: "Status de atividade registrado com sucesso (primeiro registro)."
 *       400:
 *         description: "Erro de validação, payload ou parâmetros inválidos."
 *       401:
 *         description: "Token Ausente ou Inválido."
 */
router.put(
  "/status/:gameId",
  authMiddleware,
  ValidateSchema(UpdateStatusSchema),
  UpdateStatus
);

export { router as scoreRoutes };
