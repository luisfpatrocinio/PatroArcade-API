"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arcadeLoginRoutes = void 0;
const express_1 = require("express");
const loginArcadeController_1 = require("../controllers/loginArcadeController");
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.arcadeLoginRoutes = router;
// Essa rota vai tentar logar um usuário no painel de administrador.
// Rota para obter dados de um jogador específico
router.post("/:clientTempId", loginArcadeController_1.tryToLoginArcade);
//# sourceMappingURL=arcadeLoginRoutes.js.map