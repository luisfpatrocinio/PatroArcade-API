import { Router } from "express";
import { TryToLogin, LoginDev } from "../controllers/loginController";
import { GenerateLoginPage } from "../controllers/loginArcadeController";

// Criar uma instância do Router
const router = Router();

/**
 * @swagger
 * /login/dev:
 *   post:
 *     summary: "[DEVELOPMENT ONLY] Rota para testes manuais que ignora a presença física do Arcade"
 *     description: "Autentica um jogador diretamente sem checar Websocket ou SessionId para fins de testes Postman."
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Autenticado com sucesso, retorna JWT."
 *       400:
 *         description: "Faltando payload."
 *       401:
 *         description: "Credenciais inválidas."
 *       403:
 *         description: "Acesso negado em Produção."
 */
router.post("/dev", LoginDev);

// Rota para obter dados de um jogador específico
/**
 * @swagger
 * /login:
 *   post:
 *     summary: "Autentica um usuário web"
 *     description: "Devolve um JWT validado com as permissões do usuário"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Autenticado com sucesso, retorna JWT."
 *       401:
 *         description: "Credenciais inválidas."
 */
router.post("/:clientId", TryToLogin);

// Página de Login
router.get("/:clientId", GenerateLoginPage);

// Criar rota para deletar um jogador
router.delete("/:clientId", (req, res) => {
    res.send("Deletando um jogador");
});

// Exportar o router usando um alias
export { router as loginRoutes };
    