// src/controllers/playerController.ts

import { Request, Response } from "express";
import {
  GetPlayerByUserId,
  GetPlayerByPlayerId, // Nova função que busca pelo ID do Player
  ObtainPlayerScores,
  GetAllPlayers, // Nova função
} from "../services/playerService";
import AppError, { PlayerNotFoundError } from "../exceptions/appError"; // Importar PlayerNotFoundError

// Get the player data for the currently authenticated user
export const GetMyPlayerData = async (req: Request, res: Response) => {
  console.log("[GetMyPlayerData] Valor de req.user:", req.user);

  // 1. O authMiddleware já garantiu que req.user existe.
  //    Usamos o userId do token JWT.
  const userId = req.user!.userId;
  console.log(
    `[GetMyPlayerData] Buscando dados para o usuário autenticado: ID ${userId}`
  );

  try {
    // 2. Use o serviço (agora async) para encontrar o player associado ao userId
    const player = await GetPlayerByUserId(userId);

    // 3. Retorna o jogador
    console.log(`[GetMyPlayerData] Retornando dados do jogador: ${player.name}`);
    return res.status(200).json({
      type: "playerData",
      content: player,
    });
  } catch (error) {
    // 4. Se o serviço lançar PlayerNotFoundError
    if (error instanceof PlayerNotFoundError) {
      console.log(
        `[GetMyPlayerData] Erro: Player não encontrado para user ID: ${userId}`
      );
      return res.status(404).json({
        type: "playerDataFailed",
        content: `Player associado ao seu usuário não foi encontrado.`,
      });
    }
    // Outros erros
    console.error("[GetMyPlayerData] Erro inesperado:", error);
    return res
      .status(500)
      .json({ type: "error", content: "Erro interno do servidor" });
  }
};

// Get data for a specific player by playerId parameter (ROTA PÚBLICA)
export const GetPlayerData = async (req: Request, res: Response) => {
  try {
    // 1. Parse o playerId dos parâmetros da rota
    const playerId = Number(req.params.playerId);
    if (isNaN(playerId)) {
      return res.status(400).json({ type: "playerDataFailed", content: "ID de jogador inválido."})
    }
    console.log("[GetPlayerData] Buscando dados para o player ID: ", playerId);

    // 2. Use o novo serviço 'GetPlayerByPlayerId' (agora async)
    const player = await GetPlayerByPlayerId(playerId);

    console.log(`[GetPlayerData] Retornando dados para o jogador: ${player.name}`);
    return res.status(200).json({
      type: "playerData",
      content: player,
    });

  } catch (error) {
    if (error instanceof PlayerNotFoundError) {
      console.log(`[GetPlayerData] Erro: Player não encontrado.`);
      return res.status(404).json({
        type: "playerDataFailed",
        content: `Player ID ${req.params.playerId} não encontrado`,
      });
    }
    // Handle unexpected errors
    console.error("[GetPlayerData] Erro inesperado: ", error);
    return res.status(500).json({
      type: "serverError",
      content: "Erro inesperado ao processar a requisição.",
    });
  }
};

// Obter todos os scores de um jogador
export const GetPlayerAllScores = async (req: Request, res: Response) => {
  try {
    // 1. Lógica inteligente para pegar o ID
    // Lembre-se que adicionamos 'playerId' ao token!
    const desiredPlayerId = req.params.playerId
      ? Number(req.params.playerId)
      : req.user?.playerId; // <-- MUITO MAIS FÁCIL AGORA!

    console.log(
      `[GetPlayerAllScores] Solicitando scores para o Player ID: ${desiredPlayerId}`
    );

    if (!desiredPlayerId || isNaN(desiredPlayerId)) {
      return res.status(400).json({
        type: "playerSavesFailed",
        content: "ID do jogador é inválido ou não foi encontrado.",
      });
    }

    // 2. Chamar o serviço (agora async)
    const scores = await ObtainPlayerScores(desiredPlayerId);

    console.log(
      `[GetPlayerAllScores] Fornecendo dados de score para o Player ID: ${desiredPlayerId}`
    );
    return res.status(200).json({ type: "playerScores", content: scores });

  } catch (err: any) {
    console.error("Erro ao obter dados de score: ", err.message);
    if (err instanceof PlayerNotFoundError) {
       return res.status(err.statusCode).json({
        type: "playerScoresFailed",
        content: "Jogador não encontrado.",
      });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        type: "playerScoresFailed",
        content: err.message,
      });
    }
    return res.status(500).json({ type: "error", content: "Erro interno do servidor."})
  }
};

// Rota para admin/pública ver todos os jogadores
export const GetAllPlayersData = async (req: Request, res: Response) => {
  console.log("Obtendo todos os dados de jogadores.");
  try {
    const players = await GetAllPlayers();
    return res.status(200).json({ type: "allPlayers", content: players });
  } catch (error) {
     console.error("Erro ao buscar todos os jogadores: ", error);
     return res.status(500).json({ type: "error", content: "Erro interno do servidor."})
  }
};


// A rota 'createNewPlayer' foi removida
// pois a criação de jogador agora é de responsabilidade
// do 'registerController' através do 'CreatePlayerForUser'