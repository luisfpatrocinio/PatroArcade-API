import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  CheckCredentials,
  GetUserDataByUserName,
  UserHasPlayer,
} from "../services/userService";
import { ConnectPlayer } from "../app";
import { GetPlayerByUserId } from "../services/playerService";
import AppError from "../exceptions/appError";
import multer from "multer";
import {
  AddPlayerToClient,
  SendWebSocketMessage,
} from "../services/clientService";

const upload = multer();

export const TryToLogin = [
  upload.none(),
  async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const clientId = parseInt(req.params.clientId);

    console.log(`[LOGIN ATTEMPT]: ID: ${clientId} - ${username}.`);

    if (!username || !password || isNaN(clientId)) {
      return res.status(400).json({
        type: "loginFailed",
        content: "Dados de login inválidos.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("[LoginController] JWT_SECRET não definido.");
      return res.status(500).json({
        type: "loginFailed",
        content: "Erro de configuração no servidor.",
      });
    }

    try {
      const credentialsAreValid = await CheckCredentials(username, password);

      if (credentialsAreValid) {
        // 1. (await) Buscar dados do usuário
        const userData = await GetUserDataByUserName(username);
        const userId = userData.id;

        // Conexão com o Cliente Websocket (síncrono, pois mexe com o Map 'clients')
        ConnectPlayer(userId, clientId);
        AddPlayerToClient(clientId, userId);

        // 2. (await) Buscar dados do jogador
        const playerData = await GetPlayerByUserId(userId);

        // Criar o payload do Token JWT
        const payload = {
          userId: userData.id,
          username: userData.username,
          role: userData.role,
          playerId: playerData.id, // 3. IMPORTANTE: Adicionar o playerId ao Token!
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "8h",
        });

        const loginContent = {
          player: playerData,
          token: token,
        };

        SendWebSocketMessage(clientId, "playerJoined", loginContent);
        console.log(
          `[LoginController] Player ${username} conectado no cliente ${clientId}.`
        );

        // 4. (await) Checar se o usuário tem jogador
        // (Note que a função `GetPlayerByUserId` acima já faria isso,
        // mas é bom manter a verificação separada caso o login crie o player)
        if (!(await UserHasPlayer(userId))) {
          // Lógica para caso o usuário exista mas o player não.
          // (No nosso caso, o registerController já cuida disso)
        }

        res.status(200).json({
          type: "loginSuccess",
          content: loginContent,
        });
      } else {
        res.status(401).json({
          type: "loginFailed",
          content: "Credenciais inválidas.",
        });
      }
    } catch (error: any) {
      console.error(`[LoginController] ERROR: ${error.message}`);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          type: "loginFailed",
          content: error.message,
        });
      } else {
        res.status(500).json({
          type: "loginFailed",
          content: error.message || "Erro interno no servidor.",
        });
      }
    }
  },
];
