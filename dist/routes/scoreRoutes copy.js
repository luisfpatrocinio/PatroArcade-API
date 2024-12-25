"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreRoutes = void 0;
const express_1 = require("express");
const scoreController_1 = require("../controllers/scoreController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.scoreRoutes = router;
// Rota para obter dados de um jogador específico
router.post('/', scoreController_1.submitScore);
