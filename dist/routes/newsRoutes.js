"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsRoutes = void 0;
const express_1 = require("express");
const newsController_1 = require("../controllers/newsController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.newsRoutes = router;
// Rota para obter dados de um jogador específico
router.get("/", newsController_1.getLatestNews);
//# sourceMappingURL=newsRoutes.js.map