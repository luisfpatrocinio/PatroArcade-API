"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoutes = void 0;
const express_1 = require("express");
const loginController_1 = require("../controllers/loginController");
const loginArcadeController_1 = require("../controllers/loginArcadeController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.loginRoutes = router;
// Rota para obter dados de um jogador específico
router.post("/:clientId", loginController_1.tryToLogin);
// Página de Login
router.get("/:clientId", loginArcadeController_1.generateLoginPage);
// Criar rota para deletar um jogador
router.delete("/:clientId", (req, res) => {
    res.send("Deletando um jogador");
});
//# sourceMappingURL=loginRoutes.js.map