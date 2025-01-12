"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardRoutes = void 0;
const express_1 = require("express");
const leaderboardController_1 = require("../controllers/leaderboardController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.leaderboardRoutes = router;
// Rota para obter o leaderboards de um jogo específico.
router.get("/:gameId", leaderboardController_1.getGameLeaderboardRequest);
//# sourceMappingURL=leaderboardRoutes.js.map