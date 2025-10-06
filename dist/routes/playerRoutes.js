"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRoutes = void 0;
const express_1 = require("express");
const playerController_1 = require("../controllers/playerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const router = (0, express_1.Router)();
exports.playerRoutes = router;
// Public routes
router.post("/create", playerController_1.createNewPlayer);
router.get("/", playerController_1.getAllPlayersData);
// Player protected routes
router.get("/me", authMiddleware_1.authMiddleware, playerController_1.getMyPlayerData);
router.get("/:playerId", playerController_1.getPlayerData);
router.get("/me/saves", authMiddleware_1.authMiddleware, playerController_1.getPlayerAllSaves);
// Admin protected route
router.get("/:playerId/saves", authMiddleware_1.authMiddleware, adminAuthMiddleware_1.adminAuthMiddleware, playerController_1.getPlayerAllSaves);
//# sourceMappingURL=playerRoutes.js.map