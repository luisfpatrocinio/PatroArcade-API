import express, { Request, Response } from "express";
import { updatePlayerScore } from "../services/scoreService";
import { getPlayerByName, getPlayerByUserId } from "../services/playerService";

export function submitScore(req: Request, res: Response) {
  console.log("Requisição de pontuação recebida.");
  console.log("Função removida.");
  //   console.log(req.body);

  //   const playerId = req.body.content.userId;
  //   const playerScore = req.body.content.score;
  //   // const playerEnemiesDestroyed = req.body.enemiesDestroyed;

  //   // Atualizar info do player.
  //   updatePlayerScore(playerId, playerScore);

  //   res
  //     .json({
  //       type: "scoreReceived",
  //       content: "Score received.",
  //     })
  //     .status(200);

  //   console.log(
  //     `Pontuação recebida do Player ID: ${playerId} (${
  //       getPlayerByUserId(playerId).name
  //     }): ${playerScore}`
  //   );
}
