import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Score } from "../entities/Score";

// Obter o repositório para a tabela Score
const scoreRepository = AppDataSource.getRepository(Score);

export async function GetGameLeaderboardRequest(req: Request, res: Response) {
  try {
    const gameId = Number(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid gameId parameter" });
    }

    console.log(`[GetGameLeaderboardRequest] gameId: ${gameId}`);

    // 1. Buscar no BANCO DE DADOS
    // Encontre todos os scores para este 'gameId'
    // Ordene por 'score' em ordem decrescente
    // Pegue apenas os 10 primeiros
    // E traga as informações do 'player' relacionadas
    const records = await scoreRepository.find({
      where: { game: { id: gameId } },
      relations: {
        player: true, // Isso faz o JOIN com a tabela Player
      },
      order: {
        score: "DESC",
      },
      take: 10, // Limita a 10 resultados
    });

    // 2. Caso não haja dados
    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No data found for this gameId" });
    }

    // 3. Mapear os resultados para o formato desejado
    const leaderboard = records.map((record) => {
      // Como pedimos 'relations: { player: true }', 'record.player' existe
      return {
        playerName: record.player ? record.player.name : "Desconhecido",
        highestScore: record.score,
        sessionTimeInSeconds: record.sessionTimeInSeconds,
        lastPlayed: record.updatedAt,
      };
    });

    // 4. Retornar o leaderboard
    res.status(200).json(leaderboard);
  } catch (error: any) {
    console.error("[GetGameLeaderboardRequest] Erro:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}