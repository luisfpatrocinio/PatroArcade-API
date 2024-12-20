"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = exports.clients = void 0;
const app_1 = __importDefault(require("./app"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
// Mapa de clientes conectados ao WebSocket (fliperamas)
exports.clients = new Map();
// Cria o servidor http
const server = http_1.default.createServer(app_1.default);
// Inicializa o servidor WebSocket
exports.wss = new ws_1.WebSocketServer({ server });
let qntClients = 0;
// Eventos de conexão do WebSocket
exports.wss.on("connection", (ws) => {
    const clientId = qntClients;
    qntClients += 1;
    // Adiciona o cliente ao mapa de clientes
    exports.clients.set(clientId, { ws, players: [], id: -1 });
    console.log("Cliente WebSocket conectado:", clientId);
    ws.send(JSON.stringify({
        type: "saudacoes",
        content: { clientId },
    }));
    ws.on("message", (message) => {
        console.log("Mensagem recebida do cliente:", clientId);
        const data = JSON.parse(message.toString());
        manageGameReceivedData(ws, data);
    });
    ws.on("close", () => {
        console.log("Cliente desconectado:", clientId);
        // Remover o cliente do mapa de clientes
        exports.clients.delete(clientId);
    });
});
server.listen(PORT, () => {
    console.clear();
    console.log(`PatroTCC rodando: ${PORT}`);
});
function manageGameReceivedData(ws, data) {
    console.log(data);
    const dataMap = new Map(Object.entries(data));
    const type = dataMap.get("type");
    const content = new Map(Object.entries(dataMap.get("content")));
    switch (type) {
        case "updateClientId":
            const clientId = content.get("clientId");
            const client = getThisClient(ws);
            if (client !== -1) {
                exports.clients.get(client).id = clientId;
            }
            console.log(`[UPDATE CLIENT ID]: ${client} atualizado para ${clientId}.`);
            break;
        default:
            console.log("Tipo de mensagem não reconhecido.");
    }
}
function getThisClient(ws) {
    for (const [key, value] of exports.clients.entries()) {
        if (value.ws === ws) {
            return key;
        }
    }
    return -1;
}
