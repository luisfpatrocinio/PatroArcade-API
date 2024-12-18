import { Request, Response } from "express";
import { gameDatabase } from "../models/gameInfo";

export function getGamesData(req: Request, res: Response) {
  const games = gameDatabase;
  res.json({ type: "gamesData", content: games });
}

export function getGameDatabyGameId(req: Request, res: Response) {
  const gameId = req.params.gameId;
  console.log("Obtendo game: ", gameId);
  const game = gameDatabase.find((game) => game.id === Number(gameId));

  if (game) {
    res.json({ type: "gameData", content: game });
  } else {
    res.status(404).json({ type: "error", content: "Game not found" });
  }
}

export function getAllGamesData(req: Request, res: Response) {
  const games = gameDatabase;
  res.json({ type: "gamesData", content: games });
}
