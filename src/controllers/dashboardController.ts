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

export async function GetAdminMetrics(req: Request, res: Response) {
  const userId = req.user!.userId;
  try {
    const arcades = await GetArcadesByOwner(userId);
    const activeMachines = arcades.filter(a => a.status === "online").length;
    return res.status(200).json({
      type: "dashboardSuccess",
      content: { totalMachines: arcades.length, activeMachines }
    });
  } catch (err: any) {
    console.error(`[GetAdminMetrics] ERRO: User ${userId} - ${err.message}`);
    return res.status(500).json({
      type: "dashboardFailed",
      content: "Erro interno ao buscar métricas.",
    });
  }
}

export async function GetDashboardArcadeById(req: Request, res: Response) {
  const arcadeId = Number(req.params.id);

  if (isNaN(arcadeId)) {
    return res.status(400).json({ type: "dashboardFailed", content: "ID do Arcade inválido." });
  }

  try {
    // Usamos GetArcadesByOwner no service ou importamos DB direto?
    // Para simplificar, vou resgatar do AppDataSource aqui para manter compatibilidade com a rota isolada.
    const { AppDataSource } = require("../data-source");
    const { Arcade } = require("../entities/Arcade");
    const arcade = await AppDataSource.getRepository(Arcade).findOneBy({ id: arcadeId });
    
    if (!arcade) {
       return res.status(404).json({ type: "dashboardFailed", content: "Arcade não encontrado." });
    }

    return res.status(200).json({
      type: "dashboardSuccess",
      content: arcade,
    });
  } catch (err: any) {
    console.error(`[GetDashboardArcadeById] ERRO: Arcade ${arcadeId} - ${err.message}`);
    return res.status(500).json({
      type: "dashboardFailed",
      content: err.message,
    });
  }
}
