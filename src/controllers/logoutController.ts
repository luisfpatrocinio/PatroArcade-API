// src/controllers/logoutController.ts

import { Request, Response } from "express";
import { disconnectPlayer } from "../app";
import { wss } from "../main";
import { getUserDataByUserName } from "../services/userService"; // Agora é async
import AppError from "../exceptions/appError";
import { disconnectArcadePlayers } from "../services/arcadeService";

// 1. Torne a função 'async'
export async function logout(req: Request, res: Response) {
  const { username } = req.body;
  let userId: number; // 2. Declare userId aqui para usá-lo fora do try

  try {
    // 3. Use 'await' para esperar a busca no banco de dados
    const user = await getUserDataByUserName(username);
    userId = user.id; // 4. Salve o ID

    disconnectPlayer(userId); // Esta função (do app.ts) é síncrona, está ok
  } catch (error: any) {
    // Se o getUserDataByUserName lançar um erro (usuário não encontrado)
    if (error instanceof AppError || error.message.includes("não encontrado")) {
      res.status(404).json({
        // 404 é mais apropriado que 500
        type: "logoutError",
        content: error.message,
      });
      console.log(`[LogoutController] [logout] ${error.message}.`);
    } else {
      res.status(500).json({ type: "logoutError", content: error.message });
    }
    return;
  }

  // Logout bem-sucedido
  res.status(200).json({
    type: "logoutSuccess",
    content: `[LOGOUT] Logout do jogador ${username} realizado com sucesso.`,
  });

  // 5. Enviar mensagem para os WebSockets
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "playerLeft",
        content: {
          userId: userId, // 6. Use a variável userId que salvamos
        },
      })
    );
  });

  console.log(`[LOGOUT] Jogador ${username} desconectado.`);
}

export async function disconnectArcadePlayersRequest(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // === 1. Validação de Entrada Robusta ===
    const { arcadeId } = req.params;

    if (!arcadeId) {
      throw new AppError("O ID do fliperama é obrigatório na URL.", 400); // 400 Bad Request
    }

    const parsedArcadeId = parseInt(arcadeId, 10);
    if (isNaN(parsedArcadeId)) {
      throw new AppError("O ID do fliperama deve ser um número válido.", 400); // 400 Bad Request
    }

    // === 2. Lógica Principal (O "Caminho Feliz") ===
    const disconnectedPlayers = await disconnectArcadePlayers(parsedArcadeId);

    // Transmita a mensagem de 'playerLeft' para todos os clientes conectados.
    if (disconnectedPlayers.length > 0) {
      wss.clients.forEach((client) => {
        disconnectedPlayers.forEach((player) => {
          client.send(
            JSON.stringify({
              type: "playerLeft",
              content: { userId: player.id },
            })
          );
        });
      });
    }

    // Responda com sucesso.
    const successMessage = `[DISCONNECT] ${disconnectedPlayers.length} jogadores do fliperama ${parsedArcadeId} desconectados.`;
    console.log(successMessage);
    res.status(200).json({
      type: "disconnectArcadePlayersSuccess",
      content: successMessage,
    });
  } catch (error: any) {
    // === 3. Tratamento de Erros Inteligente (O "Caminho Triste") ===
    if (error instanceof AppError) {
      console.warn(`[Client Error] Rota /logout/arcade: ${error.message}`);
      res.status(error.statusCode).json({
        type: "clientError",
        content: error.message,
      });
    } else {
      console.error(
        `[Server Error] Falha crítica na rota /logout/arcade:`,
        error
      );
      res.status(500).json({
        type: "serverError",
        content: "Ocorreu um erro interno no servidor.",
      });
    }
  }
}
