"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSaveData = void 0;
const appError_1 = __importDefault(require("../exceptions/appError"));
const saveData_1 = require("../models/saveData");
class SaveNotFoundError extends appError_1.default {
    constructor() {
        super("Save não encontrado", 404);
    }
}
function findSaveData(playerId, gameId) {
    console.log(`[findSaveData] Procurando dados de save para o jogador ${playerId} (Game ID: ${gameId})...`);
    try {
        const save = saveData_1.saveDatabase.find((save) => save.playerId === playerId && save.gameId === gameId);
        if (save) {
            console.log("[findSaveData] Dados de save encontrados!");
            return save;
        }
        throw new SaveNotFoundError();
    }
    catch (_err) {
        console.error("Erro ao procurar dados de save: ", _err.message);
    }
}
exports.findSaveData = findSaveData;
