import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SaveData } from "../entities/SaveData";

// Obter o repositório para a tabela SaveData
const saveDataRepository = AppDataSource.getRepository(SaveData);

export async function getGameLeaderboardRequest(req: Request, res: Response) {
  try {
    const gameId = Number(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid gameId parameter" });
    }

    console.log(`[getGameLeaderboardRequest] gameId: ${gameId}`);

    // 1. Buscar no BANCO DE DADOS
    // Encontre todos os saves para este 'gameId'
    // Ordene por 'data.highestScore' em ordem decrescente
    // Pegue apenas os 10 primeiros
    // E traga as informações do 'player' relacionadas
    const gameSaves = await saveDataRepository.find({
      where: { game: { id: gameId } },
      relations: {
        player: true, // Isso faz o JOIN com a tabela Player
      },
      order: {
        data: {
          highestScore: "DESC", // Ordena pelo sub-campo 'highestScore' do JSON 'data'
        } as any, // 'as any' é necessário para ordenar por campos JSON aninhados
      },
      take: 10, // Limita a 10 resultados
    });

    // 2. Caso não haja dados
    if (!gameSaves || gameSaves.length === 0) {
      return res.status(404).json({ message: "No data found for this gameId" });
    }

    // 3. Mapear os resultados para o formato desejado
    const leaderboard = gameSaves.map((save) => {
      // Como pedimos 'relations: { player: true }', 'save.player' existe
      return {
        playerName: save.player ? save.player.name : "Desconhecido",
        highestScore: save.data.highestScore || 0, // Garante que o score exista
      };
    });

    // 4. Retornar o leaderboard
    res.status(200).json(leaderboard);
  } catch (error: any) {
    console.error("[getGameLeaderboardRequest] Erro:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}