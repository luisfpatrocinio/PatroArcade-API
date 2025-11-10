import AppError from "../exceptions/appError";
import { AppDataSource } from "../data-source";
import { SaveData } from "../entities/SaveData";
import { Player } from "../entities/Player";
import { Game } from "../entities/Game";

// Repositórios
const saveDataRepository = AppDataSource.getRepository(SaveData);

// Classe de erro customizada (pode ser movida para exceptions/appError.ts depois)
class SaveNotFoundError extends AppError {
  constructor() {
    super("Save não encontrado", 404);
  }
}

/**
 * Encontra um save específico de um jogador em um jogo.
 * Usa o ID DO JOGADOR (PK) e o ID DO JOGO (PK).
 */
export async function findSaveData(
  playerId: number,
  gameId: number
): Promise<SaveData> {
  console.log(
    `[findSaveData] Procurando dados de save para o jogador ${playerId} (Game ID: ${gameId})...`
  );

  const save = await saveDataRepository.findOne({
    where: {
      player: { id: playerId },
      game: { id: gameId },
    },
    relations: {
        game: true, // Traz info do jogo
        player: true // Traz info do player
    }
  });

  if (save) {
    console.log("[findSaveData] Dados de save encontrados!");
    return save;
  }

  throw new SaveNotFoundError();
}

/**
 * Gera uma "casca" de objeto SaveData para uma resposta 404.
 * Esta função é SÍNCRONA e NÃO TOCA no banco.
 * Ela só cria um objeto para o controller retornar.
 */
export function generateNewSaveDataShell(
  playerId: number,
  gameId: number
): Partial<SaveData> {
  console.log(
    `[generateNewSaveDataShell]\t Gerando "casca" de save para o jogador ${playerId} (Game ID: ${gameId})...`
  );
  // Retorna um objeto simples, não uma entidade
  return {
    id: 0, // Indica que não existe
    player: { id: playerId } as Player, // Apenas o suficiente para o frontend
    game: { id: gameId } as Game,
    data: {},
    lastPlayed: new Date(),
    richPresenceText: "Ainda não jogou",
  };
}

/**
 * Retorna TODOS os saves do banco. (Rota de Admin)
 */
export async function getAllSaves(): Promise<SaveData[]> {
  // Traz os saves e as informações de player e game relacionadas
  return saveDataRepository.find({
    relations: {
      player: true,
      game: true,
    },
  });
}