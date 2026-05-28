import { AppDataSource } from "../data-source";
import { Score } from "../entities/Score";
import { Player } from "../entities/Player";
import { Game } from "../entities/Game";
import { Arcade } from "../entities/Arcade";
import { AntiCheatError } from "../exceptions/appError";

const scoreRepository = AppDataSource.getRepository(Score);
const playerRepository = AppDataSource.getRepository(Player);
const gameRepository = AppDataSource.getRepository(Game);

export async function ProcessPlayerScore(
  playerId: number,
  gameId: number,
  newScore: number,
  sessionTimeInSeconds: number,
  richPresenceText?: string | null,
  arcadeId?: number | null
): Promise<{ status: "created" | "updated"; content: string }> {
  const player = await playerRepository.findOneBy({ id: playerId });
  const game = await gameRepository.findOneBy({ id: gameId });

  if (!player || !game) {
    throw new Error("Jogador ou Jogo não encontrado.");
  }

  // Validação Anti-Cheat (Baseada na Entity)
  const elapsedMinutes = sessionTimeInSeconds / 60;
  const maxAllowedScore = game.baseScoreBuffer + elapsedMinutes * game.maxScorePerMinute;

  if (newScore > maxAllowedScore) {
    throw new AntiCheatError();
  }

  let scoreRecord = await scoreRepository.findOne({
    where: {
      player: { id: playerId },
      game: { id: gameId },
    },
  });

  if (!scoreRecord) {
    // Record does not exist, create it
    scoreRecord = new Score();
    scoreRecord.player = player;
    scoreRecord.game = game;
    scoreRecord.score = newScore;
    scoreRecord.sessionTimeInSeconds = sessionTimeInSeconds;

    if (richPresenceText !== undefined) {
      scoreRecord.richPresenceText = richPresenceText;
    }

    // Vincular ao Arcade se inferido
    if (arcadeId) {
      const arcade = await AppDataSource.getRepository(Arcade).findOneBy({ id: arcadeId });
      if (arcade) scoreRecord.arcade = arcade;
    } else {
      scoreRecord.arcade = null;
    }

    await scoreRepository.save(scoreRecord);
    return { status: "created", content: "Primeiro score registrado com sucesso." };
  } else {
    // Record exists, update presence and check score
    let scoreImproved = false;

    if (richPresenceText !== undefined) {
      scoreRecord.richPresenceText = richPresenceText;
    }

    // Only update score if it's strictly greater
    if (newScore > scoreRecord.score) {
      scoreRecord.score = newScore;
      scoreRecord.sessionTimeInSeconds = sessionTimeInSeconds; // Keep time of highest score
      scoreImproved = true;
    }

    await scoreRepository.save(scoreRecord);

    if (scoreImproved) {
      return { status: "updated", content: "High Score superado e status de atividade atualizados com sucesso!" };
    } else {
      return { status: "updated", content: "Status de atividade atualizado. (Score não superou o recorde atual)." };
    }
  }
}

export async function UpdatePlayerRichPresence(
  playerId: number,
  gameId: number,
  statusText: string
): Promise<{ status: "created" | "updated"; content: string }> {
  let scoreRecord = await scoreRepository.findOne({
    where: {
      player: { id: playerId },
      game: { id: gameId },
    },
  });

  if (!scoreRecord) {
    const player = await playerRepository.findOneBy({ id: playerId });
    const game = await gameRepository.findOneBy({ id: gameId });

    if (!player || !game) {
      throw new Error("Jogador ou Jogo não encontrado.");
    }

    scoreRecord = new Score();
    scoreRecord.player = player;
    scoreRecord.game = game;
    scoreRecord.score = 0;
    scoreRecord.sessionTimeInSeconds = 0;
    scoreRecord.richPresenceText = statusText;

    await scoreRepository.save(scoreRecord);
    return { status: "created", content: "Status de atividade registrado com sucesso (primeiro registro)." };
  } else {
    scoreRecord.richPresenceText = statusText;
    await scoreRepository.save(scoreRecord);
    return { status: "updated", content: "Status de atividade atualizado com sucesso." };
  }
}
