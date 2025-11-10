import { disconnectPlayer } from "../app";
import { clients } from "../main";
import { AppDataSource } from "../data-source";
import { Arcade } from "../entities/Arcade"; // Importar Entidade
import { User } from "../entities/User"; // Importar Entidade
import { In } from "typeorm"; // Importar o 'In' para consultas "WHERE ID IN (...)"

// Repositórios
const arcadeRepository = AppDataSource.getRepository(Arcade);
const userRepository = AppDataSource.getRepository(User);

export function updateArcadeIdentifier(id: number, clientTempId: string): void {
  // Esta função mexe apenas com WebSockets, não com o banco.
  // Está correta como está.
  const allClients = Array.from(clients.values());

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

// Tornar a função 'async' para buscar no banco
export async function getArcadeInfoById(arcadeId: number): Promise<Arcade> {
  const arcade = await arcadeRepository.findOneBy({ id: arcadeId });
  if (!arcade) {
    throw new Error("Arcade not found");
  }
  return arcade;
}

/**
 * Desconecta todos os jogadores associados a um determinado fliperama.
 * @param arcadeId O ID do fliperama.
 * @returns Um array com as ENTIDADES User dos jogadores que foram desconectados.
 */
// Tornar a função 'async' e corrigir a lógica de retorno
export async function disconnectArcadePlayers(arcadeId: number): Promise<User[]> {
  const disconnectedPlayerIDs: number[] = []; // Estes são User IDs

  // 1. Encontrar o cliente e desconectar jogadores (síncrono, mexe no Map)
  const allClients = Array.from(clients.values());
  for (const client of allClients) {
    // Encontra a conexão do fliperama correto.
    if (client.id === arcadeId) {
      // Copia os IDs dos jogadores (que são User IDs)
      disconnectedPlayerIDs.push(...client.players);

      // Desconecta cada jogador
      for (const playerId of client.players) { // 'playerId' é o 'userId'
        disconnectPlayer(playerId);
      }

      // Limpa o array de jogadores do fliperama
      client.players = [];
      break;
    }
  }

  // 2. Se não tinha ninguém conectado, retorna um array vazio
  if (disconnectedPlayerIDs.length === 0) {
    return [];
  }

  // 3. Busca no banco de dados os dados dos usuários que foram desconectados
  const disconnectedUsers = await userRepository.findBy({
    id: In(disconnectedPlayerIDs), // "WHERE id IN (1, 2, 5...)"
  });

  return disconnectedUsers;
}