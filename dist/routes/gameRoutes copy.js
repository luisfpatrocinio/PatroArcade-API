"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRoutes = void 0;
const express_1 = require("express");
const gamesController_1 = require("../controllers/gamesController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.gameRoutes = router;
// Rota para obter dados de um jogador específico
router.get("/", gamesController_1.getGamesData);
router.get("/:gameId", gamesController_1.getGameDatabyGameId);
