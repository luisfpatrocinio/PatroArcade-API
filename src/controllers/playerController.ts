import express, { Request, Response } from "express";
import {
  getPlayerByName,
  getLeaderboardData,
  generateNewPlayer,
  addPlayerToDatabase,
  getPlayerByUserId,
  obtainPlayerSaves,
} from "../services/playerService";
import AppError from "../exceptions/appError";
import { playerDatabase } from "../models/playerDatabase";

// Obter dados de um jogador específico
export const getPlayerData = (req: Request, res: Response) => {
  console.log("getPlayerData acionado");
  const playerId = Number(req.params.playerId);
  const player = getPlayerByUserId(playerId);

  if (player) {
    console.log(`Fornecendo dados do jogador: ${player.name}`);
    res.status(200).json({
      type: "playerData",
      content: player,
    });
    return;
  }

  console.log(`Jogador não encontrado ID: ${playerId}`);
  res.status(404).json({
    type: "playerData",
    content: `Player ID ${playerId} not found`,
  });
};

/** Retrieves the leaderboard data and sends it as a JSON response.*/
export const getLeaderBoard = (req: Request, res: Response) => {
  const leaderboard = getLeaderboardData();
  res.json({
    type: "leaderboard",
    content: leaderboard,
  });
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
  console.log("getPlayerAllSaves acionado");
  const playerId = Number(req.params.playerId);

  try {
    const saves = obtainPlayerSaves(playerId);
    console.log(`Fornecendo dados de save para o jogador ID: ${playerId}`);
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
