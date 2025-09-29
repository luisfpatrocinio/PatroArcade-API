import { Request, Response } from "express";
import {
  getPlayerByName,
  generateNewPlayer,
  addPlayerToDatabase,
  getPlayerByUserId,
  obtainPlayerSaves,
} from "../services/playerService";
import AppError from "../exceptions/appError";
import { playerDatabase } from "../models/playerDatabase";

// Get the player data for the currently authenticated user
export const getMyPlayerData = (req: Request, res: Response) => {
  // 1. The authMiddleware has already ensured that req.user exists and is valid.
  //    We get the userId directly from the JWT token payload.
  //    This is the secure way to identify the user.
  const userId = req.user!.userId;
  console.log(
    `[getMyPlayerData] Fetching data for authenticated user: ID ${userId}`
  );

  // 2. Use the service to find the player profile associated with this userId.
  const player = getPlayerByUserId(userId);

  // 3. If a player profile is found, return the data.
  if (player) {
    console.log(`[getMyPlayerData] Returning player data: ${player.name}`);
    return res.status(200).json({
      type: "playerData",
      content: player,
    });
  }

  // 4. If no profile is found (e.g., newly created user without a player profile),
  //    return a 404 Not Found error.
  console.log(
    `[getMyPlayerData] Error: Player not found for user ID: ${userId}`
  );
  return res.status(404).json({
    type: "playerDataFailed",
    content: `Player associated with your user was not found.`,
  });
};

// Get data for a specific player by playerId parameter
export const getPlayerData = (req: Request, res: Response) => {
  try {
    // Parse playerId from request parameters
    const playerId = Number(req.params.playerId);
    console.log("[getPlayerData] Fetching data for player: ", playerId);

    // Retrieve player data using the userId (assumed to be playerId here)
    const player = getPlayerByUserId(playerId);

    // If player exists, return player data
    if (player) {
      console.log(`[getPlayerData] Returning data for player: ${player.name}`);
      return res.status(200).json({
        type: "playerData",
        content: player,
      });
    }

    // If player not found, return 404 error
    console.log(`[getPlayerData] Error: Player not found.`);
    res.status(404).json({
      type: "playerData",
      content: `Player ID ${playerId} not found`,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("[getPlayerData] Unexpected error: ", error);
    return res.status(500).json({
      type: "serverError",
      content: "Unexpected error while processing the request.",
    });
  }
};

// Criar um novo jogador. Função chamada na rota POST /players/create
// Essa rota deve receber um JSON com o nome do jogador
export const createNewPlayer = (req: Request, res: Response) => {
  const playerName = req.body.name;
  console.log(playerName);

  const player = getPlayerByName(playerName);
  console.log(`Tentando criar o Player: ${playerName}`);

  if (player) {
    // Caso o jogador já exista, retornar um erro
    console.log("Jogador já existe");
    res.status(400).json({
      type: "createNewPlayerError",
      content: `Player ${playerName} already exists`,
    });
    return;
  }

  // Caso o jogador não exista, criar um novo jogador.
  console.log("Criando como novo jogador");

  const newPlayer = generateNewPlayer(playerName);

  // Adicionar o novo jogador ao banco de dados
  addPlayerToDatabase(newPlayer);

  res.json({
    type: "newPlayerData",
    content: newPlayer,
  });
};

// Obter todos os saves de um jogador
export const getPlayerAllSaves = (req: Request, res: Response) => {
  // LÓGICA INTELIGENTE DE SELEÇÃO DE ID
  // 1. Verificamos se um 'playerId' foi fornecido na URL (rota de admin)
  // 2. Se foi, usamos esse ID
  // 3. Se não, significa que a rota 'me/saves' foi chamada, e usamos o ID do usuário autenticado (req.user)
  const desiredPlayerId = req.params.playerId
    ? Number(req.params.playerId)
    : req.user?.userId;

  console.log(
    `[getPlayerAllSaves] Solicitando saves para o ID de usuário: ${desiredPlayerId}`
  );

  if (typeof desiredPlayerId !== "number" || isNaN(desiredPlayerId)) {
    return res.status(400).json({
      type: "playerSavesFailed",
      content: "Player ID is required and must be a valid number.",
    });
  }

  try {
    const saves = obtainPlayerSaves(desiredPlayerId);
    console.log(
      `[getPlayerAllSaves] Fornecendo dados de save para o jogador ID: ${desiredPlayerId}`
    );
    return res.status(200).json({ type: "playerSaves", content: saves });
  } catch (err) {
    console.error("Erro ao obter dados de save: ", (err as Error).message);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        type: "playerSavesFailed",
        content: err.message,
      });
    }
  }
};

export const getAllPlayersData = (req: Request, res: Response) => {
  console.log("Obtendo todos os dados de jogadores.");
  return res.status(200).json({ type: "allPlayers", content: playerDatabase });
};
