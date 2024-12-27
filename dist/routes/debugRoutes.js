"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugRoutes = void 0;
const express_1 = require("express");
const main_1 = require("../main");
const userModel_1 = require("../models/userModel");
const playerDatabase_1 = require("../models/playerDatabase");
function showClients(req, res) {
    console.log("Mostrando clientes conectados.");
    console.log(main_1.clients);
    res.json({
        type: "clients",
        content: main_1.clients,
    });
}
function showUsers(req, res) {
    console.log("Obtendo todos os usuários.");
    return res.status(200).json({ type: "allUsers", content: userModel_1.usersDatabase });
}
function showPlayers(req, res) {
    console.log("Obtendo todos os jogadores.");
    return res.status(200).json({ type: "allPlayers", content: playerDatabase_1.playerDatabase });
}
// Criar uma instância do Router
const router = (0, express_1.Router)();
exports.debugRoutes = router;
// Rota para obter dados de um jogador específico
router.get("/clients", showClients);
router.get("/users", showUsers);
router.get("/players", showPlayers);
