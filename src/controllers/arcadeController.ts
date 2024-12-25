import { Request, Response } from "express";
import { getArcadeInfoById } from "../services/arcadeService";

export const fetchArcadeInfoById = (req: Request, res: Response) => {
  const arcadeId = Number(req.params.arcadeId);
  console.log("Obtendo arcade: ", arcadeId);

  try {
    const arcadeData = getArcadeInfoById(arcadeId);
    res.status(200).json({ type: "arcadeData", content: arcadeData });
  } catch (error) {
    console.log(`Arcade de ID ${arcadeId} não encontrado.`);
    res.status(404).json({ type: "arcadeData", content: null });
  }
};
