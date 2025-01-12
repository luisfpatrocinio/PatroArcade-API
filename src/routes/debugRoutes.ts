import { Request, Response } from "express";
import { Router } from "express";
import { clients } from "../main";
import { usersDatabase } from "../models/userModel";
import { playerDatabase } from "../models/playerDatabase";
import { saveDatabase } from "../models/saveData";

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

function showSaveDatas(req: Request, res: Response) {
  console.log("Obtendo todos os dados salvos.");
  return res.status(200).json({ type: "allSaves", content: saveDatabase });
}

// Criar uma instância do Router
const router = Router();

// Rota para obter dados de um jogador específico
router.get("/clients", showClients);
router.get("/users", showUsers);
router.get("/players", showPlayers);
router.get("/save", showSaveDatas);

// Exportar o router usando um alias
export { router as debugRoutes };
