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

  try {
    const save = saveDatabase.find(
      (save) => save.playerId === playerId && save.gameId === gameId
    );
    if (save) {
      console.log("[findSaveData] Dados de save encontrados!");
      return save;
    }
    throw new SaveNotFoundError();
  } catch (_err: any) {
    console.error("Erro ao procurar dados de save: ", (_err as Error).message);
  }
}
