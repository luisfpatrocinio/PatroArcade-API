import { z } from "zod";

export const RegisterSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Usuário precisa ter no mínimo 3 caracteres.")
      .max(30, "Usuário muito longo."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email inválido."),
    password: z
      .string()
      .min(6, "Senha precisa ter no mínimo 6 caracteres.")
      .max(64, "Senha muito longa."),
  }),
});
