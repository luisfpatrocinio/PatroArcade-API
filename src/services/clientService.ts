import { clients } from "../main";
import { WebSocket } from "ws";

export function clientExists(clientId: number): boolean {
  let _exists = false;

  console.log(`[DEBUG] Verificando se Arcade ${clientId} existe...`);
  console.log(`[DEBUG] Clientes conectados atualmente:`);
  clients.forEach((client, key) => {
    console.log(
      ` - Key interna: ${key} | Arcade ID Definido: ${client.id} | Players: ${client.players.length}`
    );
  });

  for (const client of clients.values()) {
    if (client.id == clientId) {
      _exists = true;
      return true;
    }
  }
  return _exists;
}

export function getClientById(clientId: number) {
  for (const client of clients.values()) {
    if (client.id == clientId) {
      return client;
    }
  }
  return null;
}

export function sendWebSocketMessage(
  clientId: number,
  type: string,
  content: any
) {
  clients.forEach((client) => {
    // Procurar o cliente pelo ID e verificar se o WebSocket está aberto
    if (client.id === clientId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({ type, content }));
    }
  });
}

export function addPlayerToClient(clientId: number, userId: number) {
  const client = getClientById(clientId);
  if (client) {
    client.players.push(userId);
  }
}
