import { AppDataSource } from "../data-source";
import { Player } from "../entities/Player";
import { Score } from "../entities/Score";
import { User } from "../entities/User";
import { PlayerNotFoundError } from "../exceptions/appError";

// Repositórios
const playerRepository = AppDataSource.getRepository(Player);
const scoreRepository = AppDataSource.getRepository(Score);

/**
 * Retorna os dados de um jogador pelo NOME.
 */
export async function GetPlayerByName(name: string): Promise<Player | null> {
  return playerRepository.findOne({ where: { name } });
}

/**
 * Retorna os dados de um jogador pelo ID DO USUÁRIO.
 * Esta é a principal forma de encontrar um jogador (ex: login, rota /me).
 */
export async function GetPlayerByUserId(userId: number): Promise<Player> {
  const player = await playerRepository.findOne({
    where: { user: { id: userId } }, // Busca pela ID da relação User
  });
  if (!player) {
    throw new PlayerNotFoundError(); // Lança o erro customizado
  }
  return player;
}

/**
 * Retorna os dados de um jogador pelo ID DO JOGADOR (chave primária).
 * Útil para a rota pública /player/:playerId
 */
export async function GetPlayerByPlayerId(playerId: number): Promise<Player> {
  const player = await playerRepository.findOne({
    where: { id: playerId },
  });
  if (!player) {
    throw new PlayerNotFoundError();
  }
  return player;
}

/**
 * Cria um novo Player e o associa a um User.
 * Esta função é chamada no registro de usuário.
 */
export async function CreatePlayerForUser(user: User): Promise<Player> {
  console.log(`Criando perfil de jogador para ${user.username}...`);
  const newPlayer = new Player();
  newPlayer.name = user.username;
  newPlayer.user = user;
  // Os outros campos (level, bio, etc.) usarão os @Column({ default: ... })
  // definidos na Entidade Player.

  return playerRepository.save(newPlayer);
}

/**
 * Obtém todos os scores de um jogador.
 */
export async function ObtainPlayerScores(playerId: number): Promise<Score[]> {
  const player = await playerRepository.findOneBy({ id: playerId });
  if (!player) {
    throw new PlayerNotFoundError();
  }

  return scoreRepository.find({
    where: { player: { id: playerId } },
    relations: {
      game: true, 
    },
  });
}

/**
 * Atualiza a pontuação total de um jogador com base nos seus saves.
 * Recebe o ID DO JOGADOR (chave primária).
 */
export async function UpdatePlayerTotalScore(
  playerId: number
): Promise<Player> {
  console.log(`[updatePlayerScore] acionado para Player ID: ${playerId}`);

  const player = await playerRepository.findOneBy({ id: playerId });
  if (!player) {
    throw new PlayerNotFoundError();
  }

  const scores = await ObtainPlayerScores(playerId);
  let totalScore = 0;

  scores.forEach((s) => {
    totalScore += s.score;
  });

  player.totalScore = totalScore;
  return playerRepository.save(player);
}

/**
 * Retorna todos os jogadores do banco de dados. (Rota de Admin)
 */
export async function GetAllPlayers(): Promise<Player[]> {
  return playerRepository.find();
}

// As funções antigas 'generateNewPlayer' e 'addPlayerToDatabase'
// foram substituídas pela 'CreatePlayerForUser' que faz o trabalho completo.
