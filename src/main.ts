import app, { disconnectPlayer, getConnectedPlayerId } from "./app";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;

// Mapa de clientes conectados ao WebSocket (fliperamas)
export const clients = new Map();

// Cria o servidor http
const server = http.createServer(app);

// Inicializa o servidor WebSocket
export const wss = new WebSocketServer({ server });

let qntClients = 0;

// Eventos de conexão do WebSocket
wss.on("connection", (ws) => {
  const clientId = qntClients;
  qntClients += 1;

  // Adiciona o cliente ao mapa de clientes
  clients.set(clientId, { ws, players: [], id: -1 });

  console.log("Cliente WebSocket conectado:", clientId);
  ws.send(
    JSON.stringify({
      type: "saudacoes", // TODO: Dar utilidade para isso.
      content: { clientId },
    })
  );

  ws.on("message", (message) => {
    console.log("Mensagem recebida do cliente:", clientId);
    const data: Map<string, any> = JSON.parse(message.toString()) as Map<
      string,
      any
    >;

    manageGameReceivedData(ws, data);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado:", clientId);
    // Remover o cliente do mapa de clientes
    clients.delete(clientId);
  });
});

server.listen(PORT, () => {
  console.clear();
  console.log(`PatroTCC rodando: ${PORT}`);
});

function manageGameReceivedData(ws: any, data: Map<string, any>) {
  console.log(data);

  const dataMap = new Map(Object.entries(data));
  const type = dataMap.get("type");
  const content = new Map(Object.entries(dataMap.get("content")));

  switch (type) {
    case "updateClientId":
      const clientId = content.get("clientId");
      const client = getThisClient(ws);
      if (client !== -1) {
        clients.get(client).id = clientId;
      }
      console.log(`[UPDATE CLIENT ID]: ${client} atualizado para ${clientId}.`);
      break;
    default:
      console.log("Tipo de mensagem não reconhecido.");
  }
}

function getThisClient(ws: any) {
  for (const [key, value] of clients.entries()) {
    if (value.ws === ws) {
      return key;
    }
  }
  return -1;
}
