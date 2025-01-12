"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesRoutes = void 0;
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.gamesRoutes = router;
// Rota para obter dados de um jogador específico
router.get("/", gameController_1.getAllGamesData);
//# sourceMappingURL=gamesRoutes.js.map