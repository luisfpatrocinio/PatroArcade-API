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
    }),
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
