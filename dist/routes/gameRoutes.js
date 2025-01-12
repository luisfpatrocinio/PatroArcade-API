"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRoutes = void 0;
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.gameRoutes = router;
// Rota para obter dados de um jogador específico
router.get("/", gameController_1.getGamesData);
router.get("/:gameId", gameController_1.getGameDatabyGameId);
//# sourceMappingURL=gameRoutes.js.map