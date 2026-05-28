import { Request, Response } from "express";
import { GetArcadeInfoById } from "../services/arcadeService"; // Agora é async

// 1. Tornar a função 'async'
export const FetchArcadeInfoById = async (req: Request, res: Response) => {
  const arcadeId = Number(req.params.arcadeId);
  console.log("Obtendo arcade: ", arcadeId);

  try {
    // 2. Usar 'await'
    const arcadeData = await GetArcadeInfoById(arcadeId);
    res.status(200).json({ type: "arcadeData", content: arcadeData });
  } catch (error) {
    console.log(`Arcade de ID ${arcadeId} não encontrado.`);
    res.status(404).json({ type: "arcadeData", content: null });
  }
};