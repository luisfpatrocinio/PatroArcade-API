"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRichPresence = exports.savePlayerData = exports.getSaveDatas = exports.getPlayerSaveData = void 0;
const saveService_1 = require("../services/saveService");
const saveData_1 = require("../models/saveData");
const playerService_1 = require("../services/playerService");
function getPlayerSaveData(req, res) {
    console.log("[getPlayerSaveData] Solicitando dados salvos...");
    const playerId = Number(req.params.playerId);
    const gameId = Number(req.params.gameId);
    // Consultar o banco de dados para obter os dados salvos do jogador
    try {
        const save = (0, saveService_1.findSaveData)(playerId, gameId);
        return res.status(200).json({ type: "playerSave", content: save });
    }
    catch (err) {
        console.error("Erro ao obter dados de save: ", err.message);
        return res.status(404).json({
            type: "playerSaveFailed",
            content: "Erro ao obter dados de save.",
        });
    }
    finally {
        console.log("[getPlayerSaveData] Solicitação de dados de save finalizada.");
    }
}
exports.getPlayerSaveData = getPlayerSaveData;
function getSaveDatas(req, res) {
    console.log("Obtendo todos os dados salvos.");
    const saves = saveData_1.saveDatabase;
    return res.status(200).json({ type: "allSaves", content: saves });
}
exports.getSaveDatas = getSaveDatas;
// Função que recebe dados do jogador do jogo e atualiza no banco de dados.
function savePlayerData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("[savePlayerData] Recebendo save do jogador...");
        const playerId = Number(req.params.playerId);
        const gameId = Number(req.params.gameId);
        const data = req.body;
        // Atualizar o banco de dados com os novos dados do jogador
        try {
            // Localiza o save do jogador no banco de dados
            const saveIndex = saveData_1.saveDatabase.findIndex((save) => save.playerId === playerId && save.gameId === gameId);
            // Ao encontrar:
            if (saveIndex !== -1) {
                saveData_1.saveDatabase[saveIndex] = Object.assign(Object.assign({}, saveData_1.saveDatabase[saveIndex]), { data, lastPlayed: new Date() });
                console.log("[savePlayerData] Dados de save atualizados com sucesso.");
                (0, playerService_1.updatePlayerTotalScore)(playerId);
                return res.status(200).json({
                    type: "playerSaveUpdated",
                    content: "Dados de save atualizados com sucesso.",
                });
            }
            // Primeira vez que o jogador salva dados
            saveData_1.saveDatabase.push({
                gameId,
                playerId,
                richPresenceText: "Jogando...",
                data,
                lastPlayed: new Date(),
            });
            console.log("[savePlayerData] Dados de save criados com sucesso.");
            return res.status(201).json({
                type: "playerSaveCreated",
                content: "Dados de save criados com sucesso.",
            });
        }
        catch (err) {
            console.error("Erro ao salvar dados de save: ", err.message);
            return res.status(500).json({
                type: "playerSaveFailed",
                content: "Erro ao salvar dados de save.",
            });
        }
        finally {
            console.log("[savePlayerData] finalizado.");
        }
    });
}
exports.savePlayerData = savePlayerData;
// Função que vai receber o texto do Rich Presence e atualizar no banco de dados.
function updateRichPresence(req, res) {
    const playerId = Number(req.params.playerId);
    const gameId = Number(req.params.gameId);
    const richPresenceText = req.body.richPresenceText;
    console.log(`[updateRichPresence] Atualizando Rich Presence para o jogador ${playerId} no jogo ${gameId}: \n`, richPresenceText);
    // Atualizar o banco de dados com o novo texto do Rich Presence
    try {
        // Localiza o save do jogador no banco de dados
        const saveIndex = saveData_1.saveDatabase.findIndex((save) => save.playerId === playerId && save.gameId === gameId);
        // Ao encontrar:
        if (saveIndex !== -1) {
            saveData_1.saveDatabase[saveIndex] = Object.assign(Object.assign({}, saveData_1.saveDatabase[saveIndex]), { richPresenceText });
            console.log("[updateRichPresence] Rich Presence atualizado com sucesso.");
            return res.status(200).json({
                type: "richPresenceUpdated",
                content: "Rich Presence atualizado com sucesso.",
            });
        }
        // Primeira vez que o jogador salva dados
        saveData_1.saveDatabase.push({
            gameId,
            playerId,
            richPresenceText,
            data: {},
            lastPlayed: new Date(),
        });
        console.log("[updateRichPresence] Rich Presence criado com sucesso.");
        return res.status(201).json({
            type: "richPresenceCreated",
            content: "Rich Presence criado com sucesso.",
        });
    }
    catch (err) {
        console.error("Erro ao atualizar Rich Presence: ", err.message);
        return res.status(500).json({
            type: "richPresenceFailed",
            content: "Erro ao atualizar Rich Presence.",
        });
    }
    finally {
        console.log("[updateRichPresence] finalizado.");
    }
}
exports.updateRichPresence = updateRichPresence;
