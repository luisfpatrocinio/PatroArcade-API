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
