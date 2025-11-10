import app from "./app";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import bcrypt from "bcrypt"; // Importar Bcrypt

// Importar as Entidades
import { User } from "./entities/User";
import { Player } from "./entities/Player";
import { Game } from "./entities/Game";
import { Arcade } from "./entities/Arcade";
import { SaveData } from "./entities/SaveData";

// Importar os DADOS ANTIGOS
import { usersDatabase } from "./models/userModel";
import { playerDatabase } from "./models/playerDatabase";
import { gameDatabase } from "./models/gameInfo";
import { arcadeDatabase } from "./models/arcadeInfo";
import { saveDatabase } from "./models/saveData";

// Carregar variáveis de ambiente
dotenv.config();

// Definir a porta do servidor
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

// Inicializar conexão com o banco de dados
AppDataSource.initialize()
  .then(async () => {
    console.log("Conectando ao Banco de Dados...");

    await seedDatabase();

    server.listen(PORT, () => {
      console.clear();
      console.log(`PatroTCC rodando: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados: ", err);
  });

function manageGameReceivedData(ws: any, data: Map<string, any>) {
  console.log(data);

  const dataMap = new Map(Object.entries(data));
  const type = dataMap.get("type");
  const content = new Map(Object.entries(dataMap.get("content")));

  switch (type) {
    case "updateClientId":
      var clientId = content.get("clientId");
      var client = getThisClient(ws);
      if (client !== -1) {
        clients.get(client).id = clientId;
      }
      console.log(`[UPDATE CLIENT ID]: ${client} atualizado para ${clientId}.`);
      break;
    case "disconnectPlayers":
      var clientId = content.get("clientId");
      var client = getThisClient(ws);
      if (client !== -1) {
        clients.get(client).players = [];
      }
      console.log(
        `[DISCONNECT PLAYERS]: Jogadores do cliente ${client} desconectados.`
      );

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

/**
 * Popula o banco de dados com os dados iniciais dos arquivos src/models/
 * se o banco de dados estiver vazio.
 */
async function seedDatabase() {
  console.log("Verificando se o banco precisa ser populado...");

  // Obter os repositórios
  const userRepository = AppDataSource.getRepository(User);
  const playerRepository = AppDataSource.getRepository(Player);
  const gameRepository = AppDataSource.getRepository(Game);
  const arcadeRepository = AppDataSource.getRepository(Arcade);
  const saveRepository = AppDataSource.getRepository(SaveData);

  // 1. Verificar se já foi populado (ex: checando se o admin "patrocinio" existe)
  const adminUser = await userRepository.findOneBy({ username: "patrocinio" });
  if (adminUser) {
    console.log("Banco de dados já populado. Pulando seeding.");
    return;
  }

  console.log("Populando o banco de dados com dados iniciais...");

  // 2. Salvar Games
  await gameRepository.save(gameDatabase); // Salva os jogos do array
  console.log("Games salvos.");

  // 3. Salvar Arcades
  await arcadeRepository.save(arcadeDatabase); // Salva os arcades do array
  console.log("Arcades salvos.");

  // 4. Salvar Usuários e Jogadores (um por um)
  for (const oldUser of usersDatabase) {
    // Criar e salvar o User
    const user = new User();
    user.username = oldUser.username;
    user.email = oldUser.email;
    user.role = oldUser.role;
    user.password = await bcrypt.hash(oldUser.password, 10); // HASH a senha!
    user.arcades = (oldUser as any).arcades || null;

    const savedUser = await userRepository.save(user);

    // Encontrar os dados do Player antigo correspondente
    const oldPlayerData = playerDatabase.find((p) => p.userId === oldUser.id);
    if (oldPlayerData) {
      // Criar e salvar o Player
      const player = new Player();
      player.name = oldPlayerData.name;
      player.level = oldPlayerData.level;
      player.expPoints = oldPlayerData.expPoints;
      player.totalScore = oldPlayerData.totalScore;
      player.bio = oldPlayerData.bio;
      player.coins = oldPlayerData.coins;
      player.avatarIndex = oldPlayerData.avatarIndex;
      player.colorIndex = oldPlayerData.colorIndex;
      player.user = savedUser; // Ligar o Player ao User

      await playerRepository.save(player);
    }
  }
  console.log("Usuários e Jogadores salvos.");

  // 5. Salvar Saves (ligando-os aos novos Players e Games)
  const allNewPlayers = await playerRepository.find();
  const allNewGames = await gameRepository.find();

  for (const oldSave of saveDatabase) {
    const newSave = new SaveData();
    newSave.richPresenceText = oldSave.richPresenceText;
    newSave.lastPlayed = oldSave.lastPlayed;
    newSave.data = oldSave.data;

    // Encontrar o Player correspondente
    const oldPlayer = playerDatabase.find((p) => p.id === oldSave.playerId);

    // Encontrar o Game correspondente
    const oldGame = gameDatabase.find((g) => g.id === oldSave.gameId);

    // A LINHA DO ERRO ESTÁ ABAIXO:
    // Nós tentámos usar oldPlayer.name e oldGame.title sem verificar

    // ADICIONE ESTA VERIFICAÇÃO:
    if (oldPlayer && oldGame) {
      const newPlayer = allNewPlayers.find((p) => p.name === oldPlayer.name);
      const newGame = allNewGames.find((g) => g.title === oldGame.title);

      if (newPlayer && newGame) {
        newSave.player = newPlayer; // Ligar o Save ao Player
        newSave.game = newGame; // Ligar o Save ao Game
        await saveRepository.save(newSave);
      }
    }
  }
  console.log("Saves salvos.");
  console.log("Banco de dados populado com sucesso!");
}
