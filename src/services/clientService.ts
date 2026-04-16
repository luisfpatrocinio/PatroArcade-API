import { clients } from "../main";
import { WebSocket } from "ws";

export function ClientExists(clientId: number): boolean {
  let exists = false;

  console.log(`[DEBUG] Verificando se Arcade ${clientId} existe...`);
  console.log(`[DEBUG] Clientes conectados atualmente:`);
  clients.forEach((client, key) => {
    console.log(
      ` - Key interna: ${key} | Arcade ID Definido: ${client.id} | Players: ${client.players.length}`
    );
  });

  for (const client of clients.values()) {
    if (client.id == clientId) {
      exists = true;
      return true;
    }
  }
  return exists;
}

export function GetClientById(clientId: number) {
  for (const client of clients.values()) {
    if (client.id == clientId) {
      return client;
    }
  }
  return null;
}

export function SendWebSocketMessage(
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

export function AddPlayerToClient(clientId: number, userId: number) {
  const client = GetClientById(clientId);
  if (client) {
    client.players.push(userId);
  }
}
