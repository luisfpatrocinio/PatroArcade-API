"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedPlayerId = exports.disconnectPlayer = exports.connectPlayer = void 0;
const tslib_1 = require("tslib");
// Importações Principais
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
// Importar Middleware de Autenticação
// import { authMiddleware } from "./middleware/authMiddleware"; // Desativado temporariamente
// Importar exceções:
const loginExceptions_1 = require("./exceptions/loginExceptions");
// Importar rotas:
const playerRoutes_1 = require("./routes/playerRoutes");
const leaderboardRoutes_1 = require("./routes/leaderboardRoutes");
const loginRoutes_1 = require("./routes/loginRoutes");
const logoutRoutes_1 = require("./routes/logoutRoutes");
const arcadeLoginRoutes_1 = require("./routes/arcadeLoginRoutes");
const newsRoutes_1 = require("./routes/newsRoutes");
const debugRoutes_1 = require("./routes/debugRoutes");
const gameRoutes_1 = require("./routes/gameRoutes");
const saveRoutes_1 = require("./routes/saveRoutes");
const gamesRoutes_1 = require("./routes/gamesRoutes");
const registerRoutes_1 = require("./routes/registerRoutes");
const arcadeRoutes_1 = require("./routes/arcadeRoutes");
// Importações que não deviam estar aqui:
const main_1 = require("./main");
const userService_1 = require("./services/userService");
const clientService_1 = require("./services/clientService");
const authMiddleware_1 = require("./middleware/authMiddleware");
// Criar a instância do Express
const app = (0, express_1.default)();
// Middleware de limitação de requisições
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.use(body_parser_1.default.json());
// --- CONFIGURAÇÃO DE ROTAS ---
// --- ROTAS PÚBLICAS (Não precisam de token) ---
app.use("/login", loginRoutes_1.loginRoutes);
app.use("/register", registerRoutes_1.registerRoutes);
app.use("/arcadeLogin", arcadeLoginRoutes_1.arcadeLoginRoutes);
app.use("/leaderboard", leaderboardRoutes_1.leaderboardRoutes);
app.use("/latestNews", newsRoutes_1.newsRoutes);
app.use("/games", gamesRoutes_1.gamesRoutes);
// --- ROTAS PROTEGIDAS (Obrigatório ter um token JWT válido) ---
app.use("/player", playerRoutes_1.playerRoutes);
app.use("/logout", logoutRoutes_1.logoutRoutes);
app.use("/game", gameRoutes_1.gameRoutes);
app.use("/save", authMiddleware_1.authMiddleware, saveRoutes_1.saveRoutes);
app.use("/arcade", arcadeRoutes_1.arcadeRoutes);
// Rota de debug (apenas em ambiente de desenvolvimento)
app.use("/debug", debugRoutes_1.debugRoutes);
// TODO: Configurar sessões
// Função para conectar o jogador num fliperama específico
function connectPlayer(userId, clientId) {
    if (!(0, clientService_1.clientExists)(clientId)) {
        throw new loginExceptions_1.ClientNotFoundException();
    }
    if ((0, userService_1.isAlreadyConnected)(userId)) {
        throw new loginExceptions_1.AlreadyConnectedException();
    }
    if ((0, userService_1.isClientFull)(clientId)) {
        throw new loginExceptions_1.ClientFullException();
    }
}
exports.connectPlayer = connectPlayer;
// Função para desconectar o jogador
function disconnectPlayer(playerId) {
    main_1.clients.forEach((client) => {
        // Remover o jogador da lista de players do cliente.
        console.log(client.players);
        if (client.players.includes(playerId)) {
            client.players.splice(client.players.indexOf(playerId), 1);
            console.log(`[DISCONNECT] Player ${playerId} disconnected from client ${client.id}.`);
        }
    });
}
exports.disconnectPlayer = disconnectPlayer;
function getConnectedPlayerId() {
    return "a";
    //   return connectedPlayerId;
}
exports.getConnectedPlayerId = getConnectedPlayerId;
// Definir rota inicial:
app.get("/", (req, res) => {
    console.log("Rota inicial acessada");
    res.json({
        type: "connected",
        content: "Bem-vindo ao servidor.",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map