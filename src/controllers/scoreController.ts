import { Request, Response } from "express";
import { ProcessPlayerScore } from "../services/scoreService";
import { UpdatePlayerTotalScore } from "../services/playerService";

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
    console.error(`[SubmitScore] ERRO: Player ${playerId}, Game ${gameId} - ${err.message}`);
    return res.status(500).json({
      type: "scoreFailed",
      content: err.message === "Jogador ou Jogo não encontrado." ? err.message : "Erro interno ao processar a pontuação.",
    });
  }
}
