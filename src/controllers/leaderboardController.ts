import { Request, Response } from "express";
import { PlayerGameData, saveDatabase } from "../models/saveData";
import { getPlayerDataById } from "../services/scoreService";

export async function getGameLeaderboardRequest(req: Request, res: Response) {
  try {
    const gameId = Number(req.params.gameId);
    console.log(`[getGameLeaderboardRequest] gameId: ${gameId}`);

    // Fail fast: se o gameId não for um número, retornar erro 400.
    if (isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid gameId parameter" });
    }

    // Filtrar os dados do jogo correto.
    const gameSaves = saveDatabase.filter(
      (save: PlayerGameData) => save.gameId === gameId
    );

    // Caso não haja dados para o gameId, retornar erro 404.
    if (gameSaves.length === 0) {
      return res.status(404).json({ message: "No data found for this gameId" });
    }

    // Ordenar por score.
    gameSaves.sort((a, b) => b.data.highestScore - a.data.highestScore);

    // Mapear para retornar apenas playerName e highestScore.
    const leaderboard = gameSaves.map((save) => {
      // Para cada save, obter o nome do jogador.
      const playerData = getPlayerDataById(save.playerId);
      return {
        playerName: playerData ? playerData.name : "Desconhecido",
        highestScore: save.data.highestScore,
      };
    });

    // Retornar os 10 primeiros.
    res.status(200).json(leaderboard.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
