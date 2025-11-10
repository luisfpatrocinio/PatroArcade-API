import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Game } from "../entities/Game";

// Obter o repositório para a tabela Game
const gameRepository = AppDataSource.getRepository(Game);

/**
 * Retorna dados de TODOS os jogos.
 * Usado em /games e /game
 */
export async function getAllGamesData(req: Request, res: Response) {
  try {
    const games = await gameRepository.find();
    res.json({ type: "gamesData", content: games });
  } catch (error: any) {
    console.error("[getAllGamesData] Erro:", error.message);
    res.status(500).json({ type: "error", content: "Erro interno do servidor" });
  }
}

/**
 * Retorna dados de um jogo específico pelo gameId.
 * Usado em /game/:gameId
 */
export async function getGameDatabyGameId(req: Request, res: Response) {
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
     console.error("[getGameDatabyGameId] Erro:", error.message);
     res.status(500).json({ type: "error", content: "Erro interno do servidor" });
  }
}

// A sua função 'getGamesData' era idêntica a 'getAllGamesData',
// então mantive 'getAllGamesData' e a 'getGameDatabyGameId'