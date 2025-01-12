"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlayerTotalScore = exports.createPlayerForUser = exports.obtainPlayerSaves = exports.getPlayerByUserId = exports.addPlayerToDatabase = exports.generateNewPlayer = exports.getPlayerByName = void 0;
// Serviços para Manipulação de Dados
const appError_1 = require("../exceptions/appError");
const playerDatabase_1 = require("../models/playerDatabase");
const saveData_1 = require("../models/saveData");
// Retornar os dados de um jogaor específico
const getPlayerByName = (name) => {
    return playerDatabase_1.playerDatabase.find((player) => player.name === name);
};
exports.getPlayerByName = getPlayerByName;
// Gera um novo objeto de jogador, sem ID.
function generateNewPlayer(playerName) {
    const _newPlayer = {
        name: playerName,
        level: 1,
        expPoints: 0,
        totalScore: 0,
        bio: "Novo Jogador",
        coins: 0,
        avatarIndex: 1,
        colorIndex: 1,
    };
    return _newPlayer;
}
exports.generateNewPlayer = generateNewPlayer;
// Adiciona um jogador ao banco de dados
function addPlayerToDatabase(playerData) {
    playerData.id = playerDatabase_1.playerDatabase.length + 1;
    const completePlayerData = playerData;
    playerDatabase_1.playerDatabase.push(completePlayerData);
}
exports.addPlayerToDatabase = addPlayerToDatabase;
function getPlayerByUserId(userId) {
    const player = playerDatabase_1.playerDatabase.find((player) => player.userId === userId);
    if (!player) {
        throw new Error(`Player with userId ${userId} not found`);
    }
    return player;
}
exports.getPlayerByUserId = getPlayerByUserId;
function obtainPlayerSaves(playerId) {
    // Verifica se o jogador existe
    const player = playerDatabase_1.playerDatabase.find((player) => player.userId === playerId);
    if (!player) {
        throw new appError_1.PlayerNotFoundError();
    }
    const saves = saveData_1.saveDatabase.filter((save) => save.playerId === playerId);
    return saves;
}
exports.obtainPlayerSaves = obtainPlayerSaves;
// Através das informações de um usuário, cria um novo Player.
function createPlayerForUser(user) {
    const newPlayer = generateNewPlayer(user.username);
    newPlayer.userId = user.id;
    addPlayerToDatabase(newPlayer);
}
exports.createPlayerForUser = createPlayerForUser;
// Essa função consulta todos os saves pertecentes a esse usuário, e ajusta o valor de totalScore com base nos scores de cada jogo.
const updatePlayerTotalScore = (playerId) => {
    console.log("[updatePlayerScore] acionado");
    try {
        const player = getPlayerByUserId(playerId);
        if (!player) {
            throw new appError_1.PlayerNotFoundError();
        }
        const saves = obtainPlayerSaves(playerId);
        let totalScore = 0;
        saves.forEach((save) => {
            // conferir se há totalScore no save:
            if (save.data.totalScore) {
                totalScore += save.data.totalScore;
            }
        });
        player.totalScore = totalScore;
        return player;
    }
    catch (err) {
        console.error("[updatePlayerScore] Erro ao atualizar score do jogador: ", err.message);
        throw err;
    }
};
exports.updatePlayerTotalScore = updatePlayerTotalScore;
//# sourceMappingURL=playerService.js.map