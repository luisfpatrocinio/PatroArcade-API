import { Request, Response } from "express";
import { disconnectPlayer } from "../app";
import { wss } from "../main";
import { getUserDataByUserName } from "../services/userService";
import AppError from "../exceptions/appError";
import { disconnectArcadePlayers } from "../services/arcadeService";

export function logout(req: Request, res: Response) {
  const { username } = req.body;

  try {
    const userId = getUserDataByUserName(username).id;
    disconnectPlayer(userId);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        type: "logoutError",
        content: error.message,
      });
      console.log(`[LogoutController] [logout] ${error.message}.`);
    }
    return;
  }

  // Logout bem-sucedido
  res.status(200).json({
    type: "logoutSuccess",
    content: `[LOGOUT] Logout do jogador ${username} realizado com sucesso.`,
  });

  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "playerLeft",
        content: {
          userId: getUserDataByUserName(username).id,
        },
      })
    );
  });

  console.log(`[LOGOUT] Jogador ${username} desconectado.`);
}

export function disconnectArcadePlayersRequest(req: Request, res: Response) {
  const { arcadeId } = req.body;

  // Desconectar jogadores do fliperama
  disconnectArcadePlayers(parseInt(arcadeId));

  res.status(200).json({
    type: "disconnectArcadePlayersSuccess",
    content: `[DISCONNECT] Jogadores do fliperama ${arcadeId} desconectados.`,
  });

  console.log(`[DISCONNECT] Jogadores do fliperama ${arcadeId} desconectados.`);
}
