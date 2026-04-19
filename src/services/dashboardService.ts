import { AppDataSource } from "../data-source";
import { Arcade } from "../entities/Arcade";
import { Score } from "../entities/Score";

const arcadeRepository = AppDataSource.getRepository(Arcade);
const scoreRepository = AppDataSource.getRepository(Score);

export async function GetArcadesByOwner(ownerId: number): Promise<Arcade[]> {
  return arcadeRepository.find({
    where: { ownerId },
  });
}

export async function GetArcadeMetrics(arcadeId: number): Promise<{
  status: string;
  uptimeMinutes: number | null;
  currentGameId: number | null;
  totalSessions: number;
}> {
  const arcade = await arcadeRepository.findOneBy({ id: arcadeId });

  if (!arcade) {
    throw new Error("Arcade não encontrado.");
  }

  // Calcular uptime em minutos a partir do lastBootTime
  let uptimeMinutes: number | null = null;
  if (arcade.status === "online" && arcade.lastBootTime) {
    const diffMs = new Date().getTime() - new Date(arcade.lastBootTime).getTime();
    uptimeMinutes = Math.floor(diffMs / 60000);
  }

  // Total de sessões (count de Scores vinculados a este arcade)
  const totalSessions = await scoreRepository.count({
    where: { arcade: { id: arcadeId } },
  });

  return {
    status: arcade.status,
    uptimeMinutes,
    currentGameId: arcade.currentGameId,
    totalSessions,
  };
}
