import { disconnectPlayer } from "../app";
import { clients } from "../main";
import { arcadeDatabase, ArcadeInfo } from "../models/arcadeInfo";

export function updateArcadeIdentifier(id: number, clientTempId: string): void {
  const allClients = Array.from(clients.values());

  // Enviar mensagem para todos os websockets do mapa clients.
  for (const client of allClients) {
    client.ws.send(
      JSON.stringify({
        type: "arcadeId",
        content: {
          arcadeId: id,
          tempId: clientTempId,
        },
      })
    );
  }
}

export function getArcadeInfoById(arcadeId: number): ArcadeInfo {
  const arcade = arcadeDatabase.find((arcade) => arcade.id === arcadeId);
  if (!arcade) {
    throw new Error("Arcade not found");
  }
  return arcade;
}

export function disconnectArcadePlayers(arcadeId: number): void {
  // Percorrer os clients:
  for (const client of clients.values()) {
    if (client.arcadeId === arcadeId) {
      // Devemos desconectar os jogadores do array players.
      for (const player of client.players) {
        disconnectPlayer(player);
      }
    }
  }
}
