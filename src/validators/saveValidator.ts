import { z } from "zod";

export const SaveDataSchema = z.object({
  body: z
    .object({
      sessionTimeInSeconds: z.number().min(1, "A sessão deve ter durado pelo menos 1 segundo."),
      // Demais campos são opcionais e dinâmicos para suportar 'highestScore', etc.
      // E é assim que o objeto é armazenado no save.data
    })
    .catchall(z.number()) // Aceita outros campos numéricos (como score, coins, etc)
    .refine(
      (data) => {
        const time = data.sessionTimeInSeconds;
        const keys = Object.keys(data).filter(
          (k) => k !== "sessionTimeInSeconds"
        );

        for (const key of keys) {
          const value = data[key];
          if (value < 0) {
            return false; // Nenhum score pode ser negativo
          }
          
          // Lógica Genérica Anti-Cheat (Máximo 1000 pontos / 60s)
          // Score Ratio = Points / Minute
          const elapsedMinutes = time / 60;
          const maxAllowedPoints = Math.max(1000, 1000 * elapsedMinutes);

          // Se o valor de um 'highestScore' exceder os pontos máximos permitidos no tempo
          // Ex: se jogou 1 min, máximo = 1000. Se jogou menos de 1 min, máximo = 1000 base.
          if (value > maxAllowedPoints) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          "Os dados contêm valores suspeitos em relação ao tempo de sessão (Anti-Cheat) ou valores negativos.",
        path: ["AntiCheat"],
      }
    ),
  params: z.object({
    gameId: z.string().regex(/^\d+$/, "gameId deve ser um número válido."),
  }),
});

export const RichPresenceSchema = z.object({
  body: z.object({
    richPresenceText: z.string().trim().min(1, "O texto não pode estar vazio.").max(64, "O texto é muito longo."),
  }),
  params: z.object({
    gameId: z.string().regex(/^\d+$/, "gameId deve ser um número válido."),
  }),
});
