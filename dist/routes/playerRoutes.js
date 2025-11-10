"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRoutes = void 0;
const express_1 = require("express");
const playerController_1 = require("../controllers/playerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
exports.playerRoutes = router;
// Public routes
router.post("/create", playerController_1.createNewPlayer);
router.get("/", playerController_1.getAllPlayersData);
router.get("/:playerId", playerController_1.getPlayerData);
// Player protected routes
router.get("/me", authMiddleware_1.authMiddleware, playerController_1.getMyPlayerData);
router.get("/me/saves", playerController_1.getPlayerAllSaves);
// Admin protected route
router.get("/:playerId/saves", playerController_1.getPlayerAllSaves);
//# sourceMappingURL=playerRoutes.js.map