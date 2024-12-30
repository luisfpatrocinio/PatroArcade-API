"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectArcadePlayersRequest = exports.logout = void 0;
const app_1 = require("../app");
const main_1 = require("../main");
const userService_1 = require("../services/userService");
const appError_1 = __importDefault(require("../exceptions/appError"));
const arcadeService_1 = require("../services/arcadeService");
function logout(req, res) {
    const { username } = req.body;
    try {
        const userId = (0, userService_1.getUserDataByUserName)(username).id;
        (0, app_1.disconnectPlayer)(userId);
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            res.status(error.statusCode).json({
                type: "logoutError",
                content: error.message,
            });
            console.log(`[LogoutController] [logout] ${error.message}.`);
        }
        return;
    }
    // Logout bem-sucedido
    res.status(200).json({
        type: "logoutSuccess",
        content: `[LOGOUT] Logout do jogador ${username} realizado com sucesso.`,
    });
    main_1.wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "playerLeft",
            content: {
                userId: (0, userService_1.getUserDataByUserName)(username).id,
            },
        }));
    });
    console.log(`[LOGOUT] Jogador ${username} desconectado.`);
}
exports.logout = logout;
function disconnectArcadePlayersRequest(req, res) {
    const { arcadeId } = req.body;
    // Desconectar jogadores do fliperama
    (0, arcadeService_1.disconnectArcadePlayers)(parseInt(arcadeId));
    res.status(200).json({
        type: "disconnectArcadePlayersSuccess",
        content: `[DISCONNECT] Jogadores do fliperama ${arcadeId} desconectados.`,
    });
    console.log(`[DISCONNECT] Jogadores do fliperama ${arcadeId} desconectados.`);
}
exports.disconnectArcadePlayersRequest = disconnectArcadePlayersRequest;
