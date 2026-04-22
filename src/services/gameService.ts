import { AppDataSource } from "../data-source";
import { Game } from "../entities/Game";
import AppError from "../exceptions/appError";

const gameRepository = AppDataSource.getRepository(Game);

export async function createGame(data: { title: string; genre: string; description?: string }) {
  const existingGame = await gameRepository.findOneBy({ title: data.title });
  if (existingGame) {
    throw new AppError("Já existe um jogo cadastrado com este título.", 400);
  }

  // Injeta tags gerais e properties JSON vazias para evitar o erro NOT NULL
  const newGame = gameRepository.create({
    ...data,
    tags: ["Geral"],
    dataLabels: {}
  });
  
  await gameRepository.save(newGame);
  return newGame;
}
