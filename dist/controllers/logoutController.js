"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectArcadePlayersRequest = exports.logout = void 0;
const tslib_1 = require("tslib");
const app_1 = require("../app");
const main_1 = require("../main");
const userService_1 = require("../services/userService");
const appError_1 = tslib_1.__importDefault(require("../exceptions/appError"));
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
    try {
        // === 1. Validação de Entrada Robusta ===
        const { arcadeId } = req.params;
        if (!arcadeId) {
            // Lança um erro controlado que será pego pelo bloco catch.
            throw new appError_1.default("O ID do fliperama é obrigatório na URL.", 400); // 400 Bad Request
        }
        const parsedArcadeId = parseInt(arcadeId, 10);
        if (isNaN(parsedArcadeId)) {
            throw new appError_1.default("O ID do fliperama deve ser um número válido.", 400); // 400 Bad Request
        }
        // === 2. Lógica Principal (O "Caminho Feliz") ===
        // Chame o serviço. Se o serviço não encontrar o fliperama, ele deve
        // lançar um erro (ex: throw new AppError("Fliperama não encontrado", 404)),
        // que nosso catch também irá pegar.
        const disconnectedPlayers = (0, arcadeService_1.disconnectArcadePlayers)(parsedArcadeId);
        // Transmita a mensagem de 'playerLeft' para todos os clientes conectados.
        if (disconnectedPlayers.length > 0) {
            main_1.wss.clients.forEach((client) => {
                disconnectedPlayers.forEach((player) => {
                    client.send(JSON.stringify({
                        type: "playerLeft",
                        content: { userId: player.id },
                    }));
                });
            });
        }
        // Responda com sucesso.
        const successMessage = `[DISCONNECT] ${disconnectedPlayers.length} jogadores do fliperama ${parsedArcadeId} desconectados.`;
        console.log(successMessage);
        res.status(200).json({
            type: "disconnectArcadePlayersSuccess",
            content: successMessage,
        });
    }
    catch (error) {
        // === 3. Tratamento de Erros Inteligente (O "Caminho Triste") ===
        // Verifica se o erro é uma instância do nosso erro customizado.
        if (error instanceof appError_1.default) {
            // É um erro esperado (ex: validação falhou, recurso não encontrado).
            // Usamos o status e a mensagem definidos no erro.
            console.warn(`[Client Error] Rota /logout/arcade: ${error.message}`);
            res.status(error.statusCode).json({
                type: "clientError",
                content: error.message,
            });
        }
        else {
            // É um erro inesperado e não controlado.
            // Registramos o erro completo no console para depuração.
            console.error(`[Server Error] Falha crítica na rota /logout/arcade:`, error);
            // Enviamos uma resposta genérica para o cliente por segurança.
            res.status(500).json({
                type: "serverError",
                content: "Ocorreu um erro interno no servidor.",
            });
        }
    }
}
exports.disconnectArcadePlayersRequest = disconnectArcadePlayersRequest;
//# sourceMappingURL=logoutController.js.map