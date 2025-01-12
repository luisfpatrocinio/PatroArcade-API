"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlayerToClient = exports.sendWebSocketMessage = exports.getClientById = exports.clientExists = void 0;
const main_1 = require("../main");
const ws_1 = require("ws");
function clientExists(clientId) {
    let _exists = false;
    for (const client of main_1.clients.values()) {
        if (client.id == clientId) {
            _exists = true;
            return true;
        }
    }
    return _exists;
}
exports.clientExists = clientExists;
function getClientById(clientId) {
    for (const client of main_1.clients.values()) {
        if (client.id == clientId) {
            return client;
        }
    }
    return null;
}
exports.getClientById = getClientById;
function sendWebSocketMessage(clientId, type, content) {
    main_1.clients.forEach((client) => {
        // Procurar o cliente pelo ID e verificar se o WebSocket está aberto
        if (client.id === clientId && client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(JSON.stringify({ type, content }));
        }
    });
}
exports.sendWebSocketMessage = sendWebSocketMessage;
function addPlayerToClient(clientId, userId) {
    const client = getClientById(clientId);
    if (client) {
        client.players.push(userId);
    }
}
exports.addPlayerToClient = addPlayerToClient;
//# sourceMappingURL=clientService.js.map