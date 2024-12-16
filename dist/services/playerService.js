"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtainPlayerSaves = exports.getPlayerByUserId = exports.addPlayerToDatabase = exports.generateNewPlayer = exports.getLeaderboardData = exports.getPlayerByName = void 0;
// Serviços para Manipulação de Dados
const appError_1 = require("../exceptions/appError");
const playerDatabase_1 = require("../models/playerDatabase");
const saveData_1 = require("../models/saveData");
// Retornar os dados de um jogaor específico
const getPlayerByName = (name) => {
    return playerDatabase_1.playerDatabase.find((player) => player.name === name);
};
exports.getPlayerByName = getPlayerByName;
// Retornar o Leaderboard
const getLeaderboardData = () => {
    return playerDatabase_1.playerDatabase
        .sort((a, b) => b.expPoints - a.expPoints)
        .map((player) => ({
        name: player.name,
        expPoints: player.expPoints,
        //   totalScore: player.totalScore,
        //   rankLevel: player.rankLevel,
    }));
};
exports.getLeaderboardData = getLeaderboardData;
// Gera um novo objeto de jogador
function generateNewPlayer(playerName, userId) {
    const _newPlayer = {
        name: playerName,
        level: 1,
        expPoints: 0,
        totalScore: 0,
        bio: "Novo Jogador",
        coins: 0,
        avatarIndex: 1,
        colorIndex: 1,
        userId: userId,
    };
    return _newPlayer;
}
exports.generateNewPlayer = generateNewPlayer;
// vou fazer silencio pq o rogerio eh chato com a gente
// Adiciona um jogador ao banco de dados
function addPlayerToDatabase(playerData) {
    playerDatabase_1.playerDatabase.push(playerData);
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
