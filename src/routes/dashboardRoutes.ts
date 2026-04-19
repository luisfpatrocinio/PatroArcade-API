import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { GetAdminArcades, GetArcadeMetricsById } from "../controllers/dashboardController";

const router = Router();

/**
 * @swagger
 * /dashboard/admin/arcades:
 *   get:
 *     summary: "Retorna todos os arcades do admin autenticado"
 *     description: "Rota Multi-Tenant. Extrai o userId do JWT e retorna apenas os arcades cujo ownerId coincide."
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de arcades do owner retornada com sucesso."
 *       401:
 *         description: "Token Ausente ou Inválido."
 *       500:
 *         description: "Erro interno ao buscar arcades."
 */
router.get("/admin/arcades", authMiddleware, GetAdminArcades);

/**
 * @swagger
 * /dashboard/arcade/{id}/metrics:
 *   get:
 *     summary: "Retorna métricas IoT em tempo real de um Arcade específico"
 *     description: "Retorna status (online/offline), uptime em minutos, jogo atual e total de sessões jogadas."
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do Arcade"
 *     responses:
 *       200:
 *         description: "Métricas retornadas com sucesso."
 *       400:
 *         description: "ID do Arcade inválido."
 *       401:
 *         description: "Token Ausente ou Inválido."
 *       404:
 *         description: "Arcade não encontrado."
 *       500:
 *         description: "Erro interno."
 */
router.get("/arcade/:id/metrics", authMiddleware, GetArcadeMetricsById);

export { router as dashboardRoutes };
