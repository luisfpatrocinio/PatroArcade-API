import { z } from "zod";

const MAX_SCORE_PER_MINUTE = Number(process.env.MAX_SCORE_PER_MINUTE) || 15000;
const BASE_SCORE_BUFFER = 5000;

export const ScoreSchema = z.object({
  body: z
    .object({
      score: z.number().min(0, "O Score não pode ser negativo."),
      sessionTimeInSeconds: z.number().min(1, "O tempo de sessão mínimo é de 1 segundo."),
      richPresenceText: z
        .string()
        .trim()
        .min(1, "O texto de status não pode ser vazio.")
        .max(100, "O texto de status pode ter no máximo 100 caracteres.")
        .nullable()
        .optional(),
    })
    .refine(
      (data) => {
        // Lógica Genérica Anti-Cheat com Buffer
        const elapsedMinutes = data.sessionTimeInSeconds / 60;
        const maxAllowedScore = BASE_SCORE_BUFFER + elapsedMinutes * MAX_SCORE_PER_MINUTE;

        if (data.score > maxAllowedScore) {
          return false;
        }

        return true;
      },
      {
        message: "Score excedeu o máximo de pontos logicamente permissivos para a duração baseada na sessão.",
        path: ["AntiCheat"],
      }
    ),
  params: z.object({
    gameId: z.string().regex(/^\d+$/, "gameId deve ser um número válido."),
  }),
});

export const UpdateStatusSchema = z.object({
  body: z.object({
    richPresenceText: z
      .string()
      .trim()
      .min(1, "O texto de status não pode ser vazio.")
      .max(100, "O texto de status pode ter no máximo 100 caracteres."),
  }),
  params: z.object({
    gameId: z.string().regex(/^\d+$/, "gameId deve ser um número válido."),
  }),
});
