import { z } from "zod";

export const createGameSchema = z.object({
  body: z.object({
    title: z.string().min(1, "O título do jogo é obrigatório"),
    genre: z.string().min(1, "O gênero do jogo é obrigatório"),
    description: z.string().optional(),
  }),
});
