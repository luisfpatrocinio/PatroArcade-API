"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arcadeRoutes = void 0;
const express_1 = require("express");
const arcadeController_1 = require("../controllers/arcadeController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.arcadeRoutes = router;
// Rota para obter dados de um jogador específico
router.get("/:arcadeId", arcadeController_1.fetchArcadeInfoById);
