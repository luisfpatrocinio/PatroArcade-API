"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRoutes = void 0;
const express_1 = require("express");
const saveController_1 = require("../controllers/saveController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.saveRoutes = router;
// Rota para obter dados de um jogador específico
router.get("/:playerId/:gameId", saveController_1.getPlayerSaveData);
// Rota para obter todos os dados salvos
router.get("/", saveController_1.getSaveDatas);
// Rota para salvar dados de um jogador
router.post("/:playerId/:gameId", saveController_1.savePlayerData);
// Rota para atualizar o Rich Presence Text
router.post("/updateRichPresence/:playerId/:gameId", saveController_1.updateRichPresence);
//# sourceMappingURL=saveRoutes.js.map