"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryToLogin = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const app_1 = require("../app");
const playerService_1 = require("../services/playerService");
const appError_1 = tslib_1.__importDefault(require("../exceptions/appError"));
const multer_1 = tslib_1.__importDefault(require("multer"));
const clientService_1 = require("../services/clientService");
const upload = (0, multer_1.default)();
exports.tryToLogin = [
    upload.none(),
    (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // Analisar credenciais recebidas
        const username = req.body.username;
        const password = req.body.password;
        const clientId = parseInt(req.params.clientId);
        console.log(`[LOGIN ATTEMPT]: ID: ${clientId} - ${username}.`);
        // Verificar se os dados de login são válidos
        if (!username || !password || isNaN(clientId)) {
            console.log("[LoginController] [tryToLogin] Dados de login inválidos.");
            return res.status(400).json({
                type: "loginFailed",
                content: "Dados de login inválidos.",
            });
        }
        // Verificação JWT
        if (!process.env.JWT_SECRET) {
            console.error("[LoginController] [tryToLogin] JWT_SECRET não está definido nas variáveis de ambiente.");
            return res.status(500).json({
                type: "loginFailed",
                content: "Erro de configuração no servidor.",
            });
        }
        // Tentar realizar o login
        try {
            const credentialsAreValid = yield (0, userService_1.checkCredentials)(username, password);
            if (credentialsAreValid) {
                const userData = (0, userService_1.getUserDataByUserName)(username);
                const userId = userData.id;
                // Conexão com o Cliente Websocket
                (0, app_1.connectPlayer)(userId, clientId);
                (0, clientService_1.addPlayerToClient)(clientId, userId);
                const playerData = (0, playerService_1.getPlayerByUserId)(userId);
                // Criar o payload do Token JWT
                const payload = {
                    userId: userData.id,
                    username: userData.username,
                    role: userData.role,
                };
                // Gerar (assinar) o token JWT
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "8h", // O token expira em 8 horas
                });
                // Cria objeto com tudo que o cliente precisa saber sobre o jogador
                const loginContent = {
                    player: playerData,
                    token: token,
                };
                (0, clientService_1.sendWebSocketMessage)(clientId, "playerJoined", loginContent);
                console.log(`[LoginController] [tryToLogin] Player ${username} conectado com sucesso no cliente ${clientId}.`);
                if (!(0, userService_1.userHasPlayer)(userId)) {
                    // Esse usuário é novo, e ainda não tem um jogador associado
                    // Retornar um erro específico para essa situação.
                }
                // Enviar o Token junto com os dados do jogador na resposta.
                res.status(200).json({
                    type: "loginSuccess",
                    content: loginContent,
                });
            }
            else {
                res.status(401).json({
                    type: "loginFailed",
                    content: "Credenciais inválidas.",
                });
                console.log(`[LoginController] [tryToLogin] Falha no login para o jogador ${username}.`);
            }
        }
        catch (error) {
            // Tratamento de Erros
            console.error(`[LoginController] [tryToLogin] ERROR: ${error.message}`);
            if (error instanceof appError_1.default) {
                console.error(`[LoginController] [tryToLogin] ${error.message}`);
                res.status(error.statusCode).json({
                    type: "loginFailed",
                    content: error.message,
                });
            }
        }
    }),
];
//# sourceMappingURL=loginController.js.map