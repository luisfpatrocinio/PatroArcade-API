"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlayerScore = exports.getPlayerDataById = exports.getPlayerDataByName = void 0;
const playerDatabase_1 = require("../models/playerDatabase");
// Função para obter os dados de um jogador pelo nome
function getPlayerDataByName(playerName) {
    return playerDatabase_1.playerDatabase.find((player) => player.name === playerName);
}
exports.getPlayerDataByName = getPlayerDataByName;
// Função para obter os dados de um jogador pelo ID
function getPlayerDataById(userId) {
    return playerDatabase_1.playerDatabase.find((player) => player.userId === userId);
}
exports.getPlayerDataById = getPlayerDataById;
// Função para atualizar a pontuação de um jogador
function updatePlayerScore(playerId, score) {
    const _player = getPlayerDataById(playerId);
    if (!_player) {
        console.log(`Jogador com ID ${playerId} não encontrado!`);
        return;
    }
    console.log(`Atualizando pontuação do jogador com ID: ${playerId} --- ${_player.name}`);
    if (_player) {
        _player.totalScore += score;
        console.log("Pontuação atualizada!");
    }
}
exports.updatePlayerScore = updatePlayerScore;
//# sourceMappingURL=scoreService.js.map