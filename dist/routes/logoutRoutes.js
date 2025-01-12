"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutRoutes = void 0;
const express_1 = require("express");
const logoutController_1 = require("../controllers/logoutController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.logoutRoutes = router;
// Rota para obter dados de um jogador específico
router.post("/", logoutController_1.logout);
router.post("/arcade/:arcadeId", logoutController_1.disconnectArcadePlayersRequest);
//# sourceMappingURL=logoutRoutes.js.map