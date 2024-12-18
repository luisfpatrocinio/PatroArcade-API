"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGamesData = exports.getGameDatabyGameId = exports.getGamesData = void 0;
const gameInfo_1 = require("../models/gameInfo");
function getGamesData(req, res) {
    const games = gameInfo_1.gameDatabase;
    res.json({ type: "gamesData", content: games });
}
exports.getGamesData = getGamesData;
function getGameDatabyGameId(req, res) {
    const gameId = req.params.gameId;
    console.log("Obtendo game: ", gameId);
    const game = gameInfo_1.gameDatabase.find((game) => game.id === Number(gameId));
    if (game) {
        res.json({ type: "gameData", content: game });
    }
    else {
        res.status(404).json({ type: "error", content: "Game not found" });
    }
}
exports.getGameDatabyGameId = getGameDatabyGameId;
function getAllGamesData(req, res) {
    const games = gameInfo_1.gameDatabase;
    res.json({ type: "gamesData", content: games });
}
exports.getAllGamesData = getAllGamesData;
