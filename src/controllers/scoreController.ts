import { Request, Response } from "express";
import { ProcessPlayerScore, UpdatePlayerRichPresence } from "../services/scoreService";
import { UpdatePlayerTotalScore } from "../services/playerService";
import { AntiCheatError } from "../exceptions/appError";

export async function SubmitScore(req: Request, res: Response) {
  const playerId = req.user!.playerId;
  const gameId = Number(req.params.gameId);
  const { score, sessionTimeInSeconds, richPresenceText } = req.body;

  if (isNaN(gameId)) {
    return res.status(400).json({ type: "scoreFailed", content: "Game ID inválido." });
  }

  try {
    const result = await ProcessPlayerScore(
      playerId,
      gameId,
      score,
      sessionTimeInSeconds,
      richPresenceText
    );

    // Update global player score whenever we receive a submission
    await UpdatePlayerTotalScore(playerId);

    const statusCode = result.status === "created" ? 201 : 200;
    
    return res.status(statusCode).json({
      type: "scoreSuccess",
      content: result.content,
    });
  } catch (err: any) {
    if (err instanceof AntiCheatError || err.name === "AntiCheatError") {
      return res.status(err.statusCode || 400).json({
        type: "validationError",
        content: [{ field: "body.AntiCheat", message: err.message }],
      });
    }

    console.error(`[SubmitScore] ERRO: Player ${playerId}, Game ${gameId} - ${err.message}`);
    return res.status(500).json({
      type: "scoreFailed",
      content: err.message === "Jogador ou Jogo não encontrado." ? err.message : "Erro interno ao processar a pontuação.",
    });
  }
}

export async function UpdateStatus(req: Request, res: Response) {
  const playerId = req.user!.playerId;
  const gameId = Number(req.params.gameId);
  const { richPresenceText } = req.body;

  if (isNaN(gameId)) {
    return res.status(400).json({ type: "scoreFailed", content: "Game ID inválido." });
  }

  try {
    const result = await UpdatePlayerRichPresence(
      playerId,
      gameId,
      richPresenceText
    );

    const statusCode = result.status === "created" ? 201 : 200;
    
    return res.status(statusCode).json({
      type: "statusUpdateSuccess",
      content: result.content,
    });
  } catch (err: any) {
    console.error(`[UpdateStatus] ERRO: Player ${playerId}, Game ${gameId} - ${err.message}`);
    return res.status(500).json({
      type: "statusUpdateFailed",
      content: err.message === "Jogador ou Jogo não encontrado." ? err.message : "Erro interno ao processar a requisição.",
    });
  }
}
