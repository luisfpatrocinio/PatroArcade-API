"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryToLogin = void 0;
const userService_1 = require("../services/userService");
const app_1 = require("../app");
const playerService_1 = require("../services/playerService");
const appError_1 = __importDefault(require("../exceptions/appError"));
const multer_1 = __importDefault(require("multer"));
const clientService_1 = require("../services/clientService");
const upload = (0, multer_1.default)();
exports.tryToLogin = [
    upload.none(),
    (req, res) => {
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
        // Tentar realizar o login
        try {
            if ((0, userService_1.checkCredentials)(username, password)) {
                const userData = (0, userService_1.getUserDataByUserName)(username);
                const userId = userData.id;
                (0, app_1.connectPlayer)(userId, clientId);
                const playerData = (0, playerService_1.getPlayerByUserId)(userId);
                (0, clientService_1.sendWebSocketMessage)(clientId, "playerJoined", playerData);
                (0, clientService_1.addPlayerToClient)(clientId, userId);
                console.log(`[LoginController] [tryToLogin] Player ${username} conectado com sucesso no cliente ${clientId}.`);
                if (!(0, userService_1.userHasPlayer)(userId)) {
                    // Esse usuário é novo, e ainda não tem um jogador associado
                    // Retornar um erro específico para essa situação.
                }
                res.status(200).json({
                    type: "loginSuccess",
                    content: playerData,
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
    },
];
