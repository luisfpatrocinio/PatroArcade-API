"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectArcadePlayers = exports.getArcadeInfoById = exports.updateArcadeIdentifier = void 0;
const app_1 = require("../app");
const main_1 = require("../main");
const arcadeInfo_1 = require("../models/arcadeInfo");
function updateArcadeIdentifier(id, clientTempId) {
    const allClients = Array.from(main_1.clients.values());
    // Enviar mensagem para todos os websockets do mapa clients.
    for (const client of allClients) {
        client.ws.send(JSON.stringify({
            type: "arcadeId",
            content: {
                arcadeId: id,
                tempId: clientTempId,
            },
        }));
    }
}
exports.updateArcadeIdentifier = updateArcadeIdentifier;
function getArcadeInfoById(arcadeId) {
    const arcade = arcadeInfo_1.arcadeDatabase.find((arcade) => arcade.id === arcadeId);
    if (!arcade) {
        throw new Error("Arcade not found");
    }
    return arcade;
}
exports.getArcadeInfoById = getArcadeInfoById;
function disconnectArcadePlayers(arcadeId) {
    // Percorrer os clients:
    for (const client of main_1.clients.values()) {
        if (client.arcadeId === arcadeId) {
            // Devemos desconectar os jogadores do array players.
            for (const player of client.players) {
                (0, app_1.disconnectPlayer)(player);
            }
        }
    }
}
exports.disconnectArcadePlayers = disconnectArcadePlayers;
//# sourceMappingURL=arcadeService.js.map