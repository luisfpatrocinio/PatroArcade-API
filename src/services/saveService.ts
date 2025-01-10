import AppError from "../exceptions/appError";
import { saveDatabase } from "../models/saveData";

class SaveNotFoundError extends AppError {
  constructor() {
    super("Save não encontrado", 404);
  }
}

export function findSaveData(playerId: number, gameId: number) {
  console.log(
    `[findSaveData] Procurando dados de save para o jogador ${playerId} (Game ID: ${gameId})...`
  );

  const save = saveDatabase.find(
    (save) => save.playerId === playerId && save.gameId === gameId
  );
  if (save) {
    console.log("[findSaveData] Dados de save encontrados!");
    return save;
  }
  throw new SaveNotFoundError();
}

export function generateNewSave(playerId: number, gameId: number) {
  console.log(
    `[generateNewSave]\t Gerando novo save para o jogador ${playerId} (Game ID: ${gameId})...`
  );
  return {
    playerId,
    gameId,
    data: {},
    lastPlayed: new Date(),
  };
}
