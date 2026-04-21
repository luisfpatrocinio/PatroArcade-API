import { AppDataSource } from "../data-source";
import { Game } from "../entities/Game";
import AppError from "../exceptions/appError";

const gameRepository = AppDataSource.getRepository(Game);

export async function createGame(data: { title: string; genre: string; description?: string }) {
  const existingGame = await gameRepository.findOneBy({ title: data.title });
  if (existingGame) {
    throw new AppError("Já existe um jogo cadastrado com este título.", 400);
  }

  const newGame = gameRepository.create(data);
  await gameRepository.save(newGame);
  return newGame;
}
