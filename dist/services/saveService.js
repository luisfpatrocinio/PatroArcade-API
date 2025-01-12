"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewSave = exports.findSaveData = void 0;
const tslib_1 = require("tslib");
const appError_1 = tslib_1.__importDefault(require("../exceptions/appError"));
const saveData_1 = require("../models/saveData");
class SaveNotFoundError extends appError_1.default {
    constructor() {
        super("Save não encontrado", 404);
    }
}
function findSaveData(playerId, gameId) {
    console.log(`[findSaveData] Procurando dados de save para o jogador ${playerId} (Game ID: ${gameId})...`);
    const save = saveData_1.saveDatabase.find((save) => save.playerId === playerId && save.gameId === gameId);
    if (save) {
        console.log("[findSaveData] Dados de save encontrados!");
        return save;
    }
    throw new SaveNotFoundError();
}
exports.findSaveData = findSaveData;
function generateNewSave(playerId, gameId) {
    console.log(`[generateNewSave]\t Gerando novo save para o jogador ${playerId} (Game ID: ${gameId})...`);
    return {
        playerId,
        gameId,
        data: {},
        lastPlayed: new Date(),
    };
}
exports.generateNewSave = generateNewSave;
//# sourceMappingURL=saveService.js.map