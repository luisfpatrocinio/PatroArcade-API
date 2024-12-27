import express, { Request, Response } from "express";
import { Router } from "express";
import { clients } from "../main";
import { usersDatabase } from "../models/userModel";
import { playerDatabase } from "../models/playerDatabase";

function showClients(req: Request, res: Response) {
  console.log("Mostrando clientes conectados.");
  console.log(clients);

  res.json({
    type: "clients",
    content: clients,
  });
}

function showUsers(req: Request, res: Response) {
  console.log("Obtendo todos os usuários.");
  return res.status(200).json({ type: "allUsers", content: usersDatabase });
}

function showPlayers(req: Request, res: Response) {
  console.log("Obtendo todos os jogadores.");
  return res.status(200).json({ type: "allPlayers", content: playerDatabase });
}

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/clients", showClients);
router.get("/users", showUsers);
router.get("/players", showPlayers);

// Exportar o router usando um alias
export { router as debugRoutes };
