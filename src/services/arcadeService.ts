import { disconnectPlayer } from "../app";
import { clients } from "../main";
import { arcadeDatabase, ArcadeInfo } from "../models/arcadeInfo";
import { User } from "../models/userModel"; 

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

/**
 * Desconecta todos os jogadores associados a um determinado fliperama.
 * @param arcadeId O ID do fliperama.
 * @returns Um array com os dados dos jogadores que foram desconectados.
 */
// MUDANÇA 1: Altere a assinatura da função para retornar um array de 'User'.
// Se o seu tipo de jogador for diferente, substitua 'User[]' pelo tipo correto.
export function disconnectArcadePlayers(arcadeId: number): User[] {
    // MUDANÇA 2: Crie um array para armazenar os jogadores que serão removidos.
    const disconnectedPlayers: User[] = [];
  
    // Percorrer os clients (a sua lógica original está correta):
    const allClients = Array.from(clients.values());
    console.log("allClients:", allClients);

    for (const client of allClients) {
      // Encontra a conexão do fliperama correto.
      if (client.id === arcadeId) {
        
        // MUDANÇA 3: Antes de desconectar, adicione os jogadores à nossa lista.
        // Usamos o operador 'spread' (...) para criar uma cópia e evitar problemas de referência.
        disconnectedPlayers.push(...client.players);
        
        // Agora, percorra os jogadores para desconectá-los individualmente.
        for (const player of client.players) {
          // A função disconnectPlayer remove o jogador do estado global.
          disconnectPlayer(player); 
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
