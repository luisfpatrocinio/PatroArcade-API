import { Request, Response } from "express";
import {
  checkCredentials,
  getUserDataByUserName,
} from "../services/userService";
import { connectPlayer } from "../app";
import { getPlayerByUserId } from "../services/playerService";
import AppError from "../exceptions/appError";
import multer from "multer";
import {
  addPlayerToClient,
  sendWebSocketMessage,
} from "../services/clientService";

const upload = multer();

export const tryToLogin = [
  upload.none(),
  (req: Request, res: Response) => {
    // Analisar credenciais recebidas
    const username = req.body.username;
    const password = req.body.password;
    const clientId = parseInt(req.params.clientId);

    console.log("Printando body:");
    console.log(req.body);

    console.log(`[LOGIN ATTEMPT]: ID: ${clientId} - ${username}.`);

    // Verificar se os dados de login são válidos
    if (!username || !password || isNaN(clientId)) {
      console.log("[LoginController] [tryToLogin] Dados de login inválidos.");
      return res.status(400).json({
        type: "loginFailed",
        content: "Dados de login inválidos.",
      });
    }

    // Tentar realizar o login
    try {
      if (checkCredentials(username, password)) {
        const userData = getUserDataByUserName(username);
        const userId = userData.id;
        connectPlayer(userId, clientId);
        const playerData = getPlayerByUserId(userId);
        res.status(200).json({
          type: "loginSuccess",
          content: playerData,
        });
        sendWebSocketMessage(clientId, "playerJoined", playerData);
        addPlayerToClient(clientId, userId);
        console.log(
          `[LoginController] [tryToLogin] Player ${username} conectado com sucesso no cliente ${clientId}.`
        );
      } else {
        res.status(401).json({
          type: "loginFailed",
          content: "Credenciais inválidas.",
        });
        console.log(
          `[LoginController] [tryToLogin] Falha no login para o jogador ${username}.`
        );
      }
    } catch (error: any) {
      // Tratamento de Erros
      console.error(`[LoginController] [tryToLogin] ERROR: ${error.message}`);
      if (error instanceof AppError) {
        console.error(`[LoginController] [tryToLogin] ${error.message}`);
        res.status(error.statusCode).json({
          type: "loginFailed",
          content: error.message,
        });
      }
    }
  },
];
