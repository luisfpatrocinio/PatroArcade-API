import { z } from "zod";

export const LeaderboardParamSchema = z.object({
  params: z.object({
    gameId: z.string().regex(/^\d+$/, "Game ID inválido. Deve ser numérico."),
  }),
});
