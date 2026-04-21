import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Game } from "../entities/Game";
import { createGame } from "../services/gameService";

// Obter o repositório para a tabela Game
const gameRepository = AppDataSource.getRepository(Game);

/**
 * Retorna dados de TODOS os jogos.
 * Usado em /games e /game
 */
export async function GetAllGamesData(req: Request, res: Response) {
  try {
    const games = await gameRepository.find();
    res.json({ type: "gamesData", content: games });
  } catch (error: any) {
    console.error("[GetAllGamesData] Erro:", error.message);
    res.status(500).json({ type: "error", content: "Erro interno do servidor" });
  }
}

/**
 * Retorna dados de um jogo específico pelo gameId.
 * Usado em /game/:gameId
 */
export async function GetGameDatabyGameId(req: Request, res: Response) {
  try {
    const gameId = Number(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ type: "error", content: "Game ID inválido" });
    }
    
    console.log("Obtendo game: ", gameId);
    const game = await gameRepository.findOneBy({ id: gameId });

    if (game) {
      res.json({ type: "gameData", content: game });
    } else {
      res.status(404).json({ type: "error", content: "Game not found" });
    }
  } catch (error: any) {
     console.error("[GetGameDatabyGameId] Erro:", error.message);
     res.status(500).json({ type: "error", content: "Erro interno do servidor" });
  }
}

export async function CreateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, genre, description } = req.body;
    const newGame = await createGame({ title, genre, description });
    res.status(201).json({ message: "Jogo cadastrado com sucesso", content: newGame });
  } catch (error) {
    next(error);
  }
}