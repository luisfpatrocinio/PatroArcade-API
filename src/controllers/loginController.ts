import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  checkCredentials,
  getUserDataByUserName,
  userHasPlayer,
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

    console.log(`[LOGIN ATTEMPT]: ID: ${clientId} - ${username}.`);

    // Verificar se os dados de login são válidos
    if (!username || !password || isNaN(clientId)) {
      console.log("[LoginController] [tryToLogin] Dados de login inválidos.");
      return res.status(400).json({
        type: "loginFailed",
        content: "Dados de login inválidos.",
      });
    }

    // Verificação JWT
    if (!process.env.JWT_SECRET) {
      console.error(
        "[LoginController] [tryToLogin] JWT_SECRET não está definido nas variáveis de ambiente."
      );
      return res.status(500).json({
        type: "loginFailed",
        content: "Erro de configuração no servidor.",
      });
    }

    // Tentar realizar o login
    try {
      const credentialsAreValid = checkCredentials(username, password);
      if (credentialsAreValid) {
        const userData = getUserDataByUserName(username);
        const userId = userData.id;

        // Conexão com o Cliente Websocket
        connectPlayer(userId, clientId);
        addPlayerToClient(clientId, userId);
        const playerData = getPlayerByUserId(userId);
        sendWebSocketMessage(clientId, "playerJoined", playerData);

        // Criar o payload do Token JWT
        const payload = {
          userId: userData.id,
          username: userData.username,
          role: userData.role,
        };

        // Gerar (assinar) o token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "8h", // O token expira em 8 horas
        });

        console.log(
          `[LoginController] [tryToLogin] Player ${username} conectado com sucesso no cliente ${clientId}.`
        );

        if (!userHasPlayer(userId)) {
          // Esse usuário é novo, e ainda não tem um jogador associado
          // Retornar um erro específico para essa situação.
        }

        // Enviar o Token junto com os dados do jogador na resposta.
        res.status(200).json({
          type: "loginSuccess",
          content: {
            player: playerData,
            token: token,
          },
        });
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
