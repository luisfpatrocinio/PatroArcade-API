import { Request, Response } from "express";
import { GetArcadesByOwner, GetArcadeMetrics } from "../services/dashboardService";

export async function GetAdminArcades(req: Request, res: Response) {
  const userId = req.user!.userId;

  try {
    const arcades = await GetArcadesByOwner(userId);
    return res.status(200).json({
      type: "dashboardSuccess",
      content: arcades,
    });
  } catch (err: any) {
    console.error(`[GetAdminArcades] ERRO: User ${userId} - ${err.message}`);
    return res.status(500).json({
      type: "dashboardFailed",
      content: "Erro interno ao buscar arcades.",
    });
  }
}

export async function GetArcadeMetricsById(req: Request, res: Response) {
  const arcadeId = Number(req.params.id);

  if (isNaN(arcadeId)) {
    return res.status(400).json({ type: "dashboardFailed", content: "ID do Arcade inválido." });
  }

  try {
    const metrics = await GetArcadeMetrics(arcadeId);
    return res.status(200).json({
      type: "dashboardSuccess",
      content: metrics,
    });
  } catch (err: any) {
    console.error(`[GetArcadeMetricsById] ERRO: Arcade ${arcadeId} - ${err.message}`);
    const isNotFound = err.message === "Arcade não encontrado.";
    return res.status(isNotFound ? 404 : 500).json({
      type: "dashboardFailed",
      content: err.message,
    });
  }
}
