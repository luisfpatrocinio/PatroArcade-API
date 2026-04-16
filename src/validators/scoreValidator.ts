import { z } from "zod";

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
        // Lógica Genérica Anti-Cheat (Máximo 1000 pontos / 60s)
        const elapsedMinutes = data.sessionTimeInSeconds / 60;
        const maxAllowedPoints = Math.max(1000, 1000 * elapsedMinutes);

        if (data.score > maxAllowedPoints) {
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
