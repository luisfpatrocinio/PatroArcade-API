"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlayersData = exports.getPlayerAllSaves = exports.createNewPlayer = exports.getPlayerData = exports.getMyPlayerData = void 0;
const tslib_1 = require("tslib");
const playerService_1 = require("../services/playerService");
const appError_1 = tslib_1.__importDefault(require("../exceptions/appError"));
const playerDatabase_1 = require("../models/playerDatabase");
// Get the player data for the currently authenticated user
const getMyPlayerData = (req, res) => {
    console.log("[getMyPlayerData] Controller alcançado. Valor de req.user:", req.user);
    // 1. The authMiddleware has already ensured that req.user exists and is valid.
    //    We get the userId directly from the JWT token payload.
    //    This is the secure way to identify the user.
    const userId = req.user.userId;
    console.log(`[getMyPlayerData] Fetching data for authenticated user: ID ${userId}`);
    // 2. Use the service to find the player profile associated with this userId.
    const player = (0, playerService_1.getPlayerByUserId)(userId);
    // 3. If a player profile is found, return the data.
    if (player) {
        console.log(`[getMyPlayerData] Returning player data: ${player.name}`);
        return res.status(200).json({
            type: "playerData",
            content: player,
        });
    }
    // 4. If no profile is found (e.g., newly created user without a player profile),
    //    return a 404 Not Found error.
    console.log(`[getMyPlayerData] Error: Player not found for user ID: ${userId}`);
    return res.status(404).json({
        type: "playerDataFailed",
        content: `Player associated with your user was not found.`,
    });
};
exports.getMyPlayerData = getMyPlayerData;
// Get data for a specific player by playerId parameter
const getPlayerData = (req, res) => {
    try {
        // Parse playerId from request parameters
        const playerId = Number(req.params.playerId);
        console.log("[getPlayerData] Fetching data for player: ", playerId);
        // Retrieve player data using the userId (assumed to be playerId here)
        const player = (0, playerService_1.getPlayerByUserId)(playerId);
        // If player exists, return player data
        if (player) {
            console.log(`[getPlayerData] Returning data for player: ${player.name}`);
            return res.status(200).json({
                type: "playerData",
                content: player,
            });
        }
        // If player not found, return 404 error
        console.log(`[getPlayerData] Error: Player not found.`);
        res.status(404).json({
            type: "playerData",
            content: `Player ID ${playerId} not found`,
        });
    }
    catch (error) {
        // Handle unexpected errors
        console.error("[getPlayerData] Unexpected error: ", error);
        return res.status(500).json({
            type: "serverError",
            content: "Unexpected error while processing the request.",
        });
    }
};
exports.getPlayerData = getPlayerData;
// Criar um novo jogador. Função chamada na rota POST /players/create
// Essa rota deve receber um JSON com o nome do jogador
const createNewPlayer = (req, res) => {
    const playerName = req.body.name;
    console.log(playerName);
    const player = (0, playerService_1.getPlayerByName)(playerName);
    console.log(`Tentando criar o Player: ${playerName}`);
    if (player) {
        // Caso o jogador já exista, retornar um erro
        console.log("Jogador já existe");
        res.status(400).json({
            type: "createNewPlayerError",
            content: `Player ${playerName} already exists`,
        });
        return;
    }
    // Caso o jogador não exista, criar um novo jogador.
    console.log("Criando como novo jogador");
    const newPlayer = (0, playerService_1.generateNewPlayer)(playerName);
    // Adicionar o novo jogador ao banco de dados
    (0, playerService_1.addPlayerToDatabase)(newPlayer);
    res.json({
        type: "newPlayerData",
        content: newPlayer,
    });
};
exports.createNewPlayer = createNewPlayer;
// Obter todos os saves de um jogador
const getPlayerAllSaves = (req, res) => {
    var _a;
    // LÓGICA INTELIGENTE DE SELEÇÃO DE ID
    // 1. Verificamos se um 'playerId' foi fornecido na URL (rota de admin)
    // 2. Se foi, usamos esse ID
    // 3. Se não, significa que a rota 'me/saves' foi chamada, e usamos o ID do usuário autenticado (req.user)
    const desiredPlayerId = req.params.playerId
        ? Number(req.params.playerId)
        : (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    console.log(`[getPlayerAllSaves] Solicitando saves para o ID de usuário: ${desiredPlayerId}`);
    if (typeof desiredPlayerId !== "number" || isNaN(desiredPlayerId)) {
        return res.status(400).json({
            type: "playerSavesFailed",
            content: "Player ID is required and must be a valid number.",
        });
    }
    try {
        const saves = (0, playerService_1.obtainPlayerSaves)(desiredPlayerId);
        console.log(`[getPlayerAllSaves] Fornecendo dados de save para o jogador ID: ${desiredPlayerId}`);
        return res.status(200).json({ type: "playerSaves", content: saves });
    }
    catch (err) {
        console.error("Erro ao obter dados de save: ", err.message);
        if (err instanceof appError_1.default) {
            return res.status(err.statusCode).json({
                type: "playerSavesFailed",
                content: err.message,
            });
        }
    }
};
exports.getPlayerAllSaves = getPlayerAllSaves;
const getAllPlayersData = (req, res) => {
    console.log("Obtendo todos os dados de jogadores.");
    return res.status(200).json({ type: "allPlayers", content: playerDatabase_1.playerDatabase });
};
exports.getAllPlayersData = getAllPlayersData;
//# sourceMappingURL=playerController.js.map