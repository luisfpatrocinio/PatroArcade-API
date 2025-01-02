// Serviços para Manipulação de Dados
import {
  PlayerHasNoSavesError,
  PlayerNotFoundError,
} from "../exceptions/appError";
import { Player, playerDatabase } from "../models/playerDatabase";
import { PlayerGameData, saveDatabase } from "../models/saveData";
import { User } from "../models/userModel";

// Retornar os dados de um jogaor específico
export const getPlayerByName = (name: string) => {
  return playerDatabase.find((player) => player.name === name);
};

// Gera um novo objeto de jogador, sem ID.
export function generateNewPlayer(playerName: string): Partial<Player> {
  const _newPlayer: Partial<Player> = {
    name: playerName,
    level: 1,
    expPoints: 0,
    totalScore: 0,
    bio: "Novo Jogador",
    coins: 0,
    avatarIndex: 1,
    colorIndex: 1,
  };
  return _newPlayer;
}

// Adiciona um jogador ao banco de dados
export function addPlayerToDatabase(playerData: Partial<Player>): void {
  playerData.id = playerDatabase.length + 1;
  const completePlayerData: Player = playerData as Player;
  playerDatabase.push(completePlayerData);
}

export function getPlayerByUserId(userId: number): Player {
  const player = playerDatabase.find((player) => player.userId === userId);
  if (!player) {
    throw new Error(`Player with userId ${userId} not found`);
  }
  return player;
}

export function obtainPlayerSaves(playerId: number): Array<PlayerGameData> {
  // Verifica se o jogador existe
  const player = playerDatabase.find((player) => player.userId === playerId);
  if (!player) {
    throw new PlayerNotFoundError();
  }

  const saves = saveDatabase.filter((save) => save.playerId === playerId);
  return saves;
}

// Através das informações de um usuário, cria um novo Player.
export function createPlayerForUser(user: Partial<User>) {
  const newPlayer = generateNewPlayer(user.username!);
  newPlayer.userId = user.id;
  addPlayerToDatabase(newPlayer);
}

// Essa função consulta todos os saves pertecentes a esse usuário, e ajusta o valor de totalScore com base nos scores de cada jogo.
export const updatePlayerTotalScore = (playerId: number): Player => {
  console.log("[updatePlayerScore] acionado");

  try {
    const player = getPlayerByUserId(playerId);
    if (!player) {
      throw new PlayerNotFoundError();
    }

    const saves = obtainPlayerSaves(playerId);
    let totalScore = 0;

    saves.forEach((save) => {
      // conferir se há totalScore no save:
      if (save.data.totalScore) {
        totalScore += save.data.totalScore;
      }
    });

    player.totalScore = totalScore;
    return player;
  } catch (err) {
    console.error(
      "[updatePlayerScore] Erro ao atualizar score do jogador: ",
      (err as Error).message
    );
    throw err;
  }
};
