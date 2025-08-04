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
/**
 * Desconecta todos os jogadores associados a um determinado fliperama.
 * @param arcadeId O ID do fliperama.
 * @returns Um array com os dados dos jogadores que foram desconectados.
 */
// MUDANÇA 1: Altere a assinatura da função para retornar um array de 'User'.
// Se o seu tipo de jogador for diferente, substitua 'User[]' pelo tipo correto.
function disconnectArcadePlayers(arcadeId) {
    // MUDANÇA 2: Crie um array para armazenar os jogadores que serão removidos.
    const disconnectedPlayers = [];
    // Percorrer os clients (a sua lógica original está correta):
    const allClients = Array.from(main_1.clients.values());
    for (const client of allClients) {
        // Encontra a conexão do fliperama correto.
        if (client.id === arcadeId) {
            // MUDANÇA 3: Antes de desconectar, adicione os jogadores à nossa lista.
            // Usamos o operador 'spread' (...) para criar uma cópia e evitar problemas de referência.
            disconnectedPlayers.push(...client.players);
            // Agora, percorra os jogadores para desconectá-los individualmente.
            for (const player of client.players) {
                // A função disconnectPlayer remove o jogador do estado global.
                (0, app_1.disconnectPlayer)(player);
            }
            // Importante: Depois de desconectar, limpe o array de jogadores do fliperama.
            client.players = [];
            // Como encontramos o fliperama, podemos parar o loop para otimização.
            break;
        }
    }
    // MUDANÇA 4: Retorne a lista de jogadores que foram coletados.
    return disconnectedPlayers;
}
exports.disconnectArcadePlayers = disconnectArcadePlayers;
//# sourceMappingURL=arcadeService.js.map