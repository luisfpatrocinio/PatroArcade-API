import { AppDataSource } from "../data-source";
import { Score } from "../entities/Score";
import { Player } from "../entities/Player";
import { Game } from "../entities/Game";

const scoreRepository = AppDataSource.getRepository(Score);
const playerRepository = AppDataSource.getRepository(Player);
const gameRepository = AppDataSource.getRepository(Game);

export async function ProcessPlayerScore(
  playerId: number,
  gameId: number,
  newScore: number,
  sessionTimeInSeconds: number,
  richPresenceText?: string | null
): Promise<{ status: "created" | "updated"; content: string }> {
  let scoreRecord = await scoreRepository.findOne({
    where: {
      player: { id: playerId },
      game: { id: gameId },
    },
  });

  if (!scoreRecord) {
    // Record does not exist, create it
    const player = await playerRepository.findOneBy({ id: playerId });
    const game = await gameRepository.findOneBy({ id: gameId });

    if (!player || !game) {
      throw new Error("Jogador ou Jogo não encontrado.");
    }

    scoreRecord = new Score();
    scoreRecord.player = player;
    scoreRecord.game = game;
    scoreRecord.score = newScore;
    scoreRecord.sessionTimeInSeconds = sessionTimeInSeconds;
    
    if (richPresenceText !== undefined) {
        scoreRecord.richPresenceText = richPresenceText;
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
