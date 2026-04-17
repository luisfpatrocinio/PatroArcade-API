import { Router } from "express";
import { RegisterUser } from "../controllers/registerController";
import { ValidateSchema } from "../middleware/validateSchema";
import { RegisterSchema } from "../validators/authValidator";

// Criar uma instância do Router
const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: "Registra um novo usuário"
 *     description: "Cria as tabelas de User e Player automaticamente."
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Usuário criado"
 *       400:
 *         description: "Erro de validação ou email existente"
 */
// Adicionar o array de validações como middleware
router.post(
  "/",
  ValidateSchema(RegisterSchema),
  RegisterUser // O controller só roda se a validação passar
);

export { router as registerRoutes };
