"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const express_1 = require("express");
const registerController_1 = require("../controllers/registerController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.registerRoutes = router;
// Rota para obter dados de um jogador específico
router.post("/", registerController_1.registerUser);
//# sourceMappingURL=registerRoutes.js.map