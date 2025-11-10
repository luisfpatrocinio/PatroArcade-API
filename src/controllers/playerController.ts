// src/controllers/playerController.ts

import { Request, Response } from "express";
import {
  getPlayerByUserId,
  getPlayerByPlayerId, // Nova função que busca pelo ID do Player
  obtainPlayerSaves,
  getAllPlayers, // Nova função
} from "../services/playerService";
import AppError, { PlayerNotFoundError } from "../exceptions/appError"; // Importar PlayerNotFoundError

// Get the player data for the currently authenticated user
export const getMyPlayerData = async (req: Request, res: Response) => {
  console.log("[getMyPlayerData] Valor de req.user:", req.user);

  // 1. O authMiddleware já garantiu que req.user existe.
  //    Usamos o userId do token JWT.
  const userId = req.user!.userId;
  console.log(
    `[getMyPlayerData] Buscando dados para o usuário autenticado: ID ${userId}`
  );

  try {
    // 2. Use o serviço (agora async) para encontrar o player associado ao userId
    const player = await getPlayerByUserId(userId);

    // 3. Retorna o jogador
    console.log(`[getMyPlayerData] Retornando dados do jogador: ${player.name}`);
    return res.status(200).json({
      type: "playerData",
      content: player,
    });
  } catch (error) {
    // 4. Se o serviço lançar PlayerNotFoundError
    if (error instanceof PlayerNotFoundError) {
      console.log(
        `[getMyPlayerData] Erro: Player não encontrado para user ID: ${userId}`
      );
      return res.status(404).json({
        type: "playerDataFailed",
        content: `Player associado ao seu usuário não foi encontrado.`,
      });
    }
    // Outros erros
    console.error("[getMyPlayerData] Erro inesperado:", error);
    return res
      .status(500)
      .json({ type: "error", content: "Erro interno do servidor" });
  }
};

// Get data for a specific player by playerId parameter (ROTA PÚBLICA)
export const getPlayerData = async (req: Request, res: Response) => {
  try {
    // 1. Parse o playerId dos parâmetros da rota
    const playerId = Number(req.params.playerId);
    if (isNaN(playerId)) {
      return res.status(400).json({ type: "playerDataFailed", content: "ID de jogador inválido."})
    }
    console.log("[getPlayerData] Buscando dados para o player ID: ", playerId);

    // 2. Use o novo serviço 'getPlayerByPlayerId' (agora async)
    const player = await getPlayerByPlayerId(playerId);

    console.log(`[getPlayerData] Retornando dados para o jogador: ${player.name}`);
    return res.status(200).json({
      type: "playerData",
      content: player,
    });

  } catch (error) {
    if (error instanceof PlayerNotFoundError) {
      console.log(`[getPlayerData] Erro: Player não encontrado.`);
      return res.status(404).json({
        type: "playerDataFailed",
        content: `Player ID ${req.params.playerId} não encontrado`,
      });
    }
    // Handle unexpected errors
    console.error("[getPlayerData] Erro inesperado: ", error);
    return res.status(500).json({
      type: "serverError",
      content: "Erro inesperado ao processar a requisição.",
    });
  }
};

// Obter todos os saves de um jogador
export const getPlayerAllSaves = async (req: Request, res: Response) => {
  try {
    // 1. Lógica inteligente para pegar o ID
    // Lembre-se que adicionamos 'playerId' ao token!
    const desiredPlayerId = req.params.playerId
      ? Number(req.params.playerId)
      : req.user?.playerId; // <-- MUITO MAIS FÁCIL AGORA!

    console.log(
      `[getPlayerAllSaves] Solicitando saves para o Player ID: ${desiredPlayerId}`
    );

    if (!desiredPlayerId || isNaN(desiredPlayerId)) {
      return res.status(400).json({
        type: "playerSavesFailed",
        content: "ID do jogador é inválido ou não foi encontrado.",
      });
    }

    // 2. Chamar o serviço (agora async)
    const saves = await obtainPlayerSaves(desiredPlayerId);

    console.log(
      `[getPlayerAllSaves] Fornecendo dados de save para o Player ID: ${desiredPlayerId}`
    );
    return res.status(200).json({ type: "playerSaves", content: saves });

  } catch (err: any) {
    console.error("Erro ao obter dados de save: ", err.message);
    if (err instanceof PlayerNotFoundError) {
       return res.status(err.statusCode).json({
        type: "playerSavesFailed",
        content: "Jogador não encontrado.",
      });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        type: "playerSavesFailed",
        content: err.message,
      });
    }
    return res.status(500).json({ type: "error", content: "Erro interno do servidor."})
  }
};

// Rota para admin/pública ver todos os jogadores
export const getAllPlayersData = async (req: Request, res: Response) => {
  console.log("Obtendo todos os dados de jogadores.");
  try {
    const players = await getAllPlayers();
    return res.status(200).json({ type: "allPlayers", content: players });
  } catch (error) {
     console.error("Erro ao buscar todos os jogadores: ", error);
     return res.status(500).json({ type: "error", content: "Erro interno do servidor."})
  }
};


// A rota 'createNewPlayer' foi removida
// pois a criação de jogador agora é de responsabilidade
// do 'registerController' através do 'createPlayerForUser'