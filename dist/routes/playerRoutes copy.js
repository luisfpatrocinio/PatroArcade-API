"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRoutes = void 0;
const express_1 = require("express");
const playerController_1 = require("../controllers/playerController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.playerRoutes = router;
// Rota para obter dados de um jogador específico
router.post("/create", playerController_1.createNewPlayer);
router.get("/", playerController_1.getAllPlayersData);
router.get("/:playerId", playerController_1.getPlayerData);
router.get("/:playerId/saves", playerController_1.getPlayerAllSaves);
