import { Router } from "express";
import { GetGameLeaderboardRequest } from "../controllers/leaderboardController";
import { ValidateSchema } from "../middleware/validateSchema";
import { LeaderboardParamSchema } from "../validators/leaderboardValidator";

// Criar uma instância do Router
const router = Router();

/**
 * @swagger
 * /leaderboard/{gameId}:
 *   get:
 *     summary: "Obtém as 10 maiores pontuações mundiais do jogo escolhido"
 *     description: "Retorna a listagem decrescente com os perfis dos competidores e data."
 *     tags: [Leaderboard]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Lista do Top 10 com sucesso"
 *       404:
 *         description: "Nenhum dado encontrado para o jogo"
 */
router.get("/:gameId", ValidateSchema(LeaderboardParamSchema), GetGameLeaderboardRequest);

// Exportar o router usando um alias
export { router as leaderboardRoutes };
