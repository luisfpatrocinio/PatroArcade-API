"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRoutes = void 0;
const express_1 = require("express");
const saveController_1 = require("../controllers/saveController");
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const router = (0, express_1.Router)();
exports.saveRoutes = router;
// --- Rotas do Jogador (Godot) ---
// CORREÇÃO: Adicionada a barra "/" entre "me" e ":gameId".
router.get("/me/:gameId", saveController_1.getPlayerSaveData);
router.post("/me/:gameId", saveController_1.savePlayerData);
// Esta já estava correta, mas mantemos aqui para consistência.
router.post("/me/updateRichPresence/:gameId", saveController_1.updateRichPresence);
// --- Rotas do Admin (Para o Webserver) ---
// A ordem está correta, mas as rotas de jogador precisam estar certas para serem encontradas primeiro.
router.get("/", adminAuthMiddleware_1.adminAuthMiddleware, saveController_1.getSaveDatas);
router.get("/:playerId/:gameId", adminAuthMiddleware_1.adminAuthMiddleware, saveController_1.getPlayerSaveData);
//# sourceMappingURL=saveRoutes.js.map