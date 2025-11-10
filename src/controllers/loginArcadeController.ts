import { Request, Response } from "express";
import {
  checkCredentials,
  getUserDataByUserName,
} from "../services/userService";
import { updateArcadeIdentifier } from "../services/arcadeService";
import { UserIsNotAdminException } from "../exceptions/loginExceptions";
import { AdminUser } from "../models/userModel";
import dotenv from "dotenv";
dotenv.config();

const pageUrl = process.env.PAGEURL || "http://localhost:5999";

export async function tryToLoginArcade(req: Request, res: Response) {
  // Analisa credenciais recebidas.
  const clientTempId = req.params.clientTempId;
  const { username, password } = req.body;
  console.log(
    `[ADMIN LOGIN ATTEMPT]: Temp ID: ${clientTempId} \n${username} : ${password}.`
  );

  try {
    // Verifica se as credenciais são válidas.
    if (await checkCredentials(username, password)) {
      // Credenciais válidas. Checando se é um admin.
      const user = (await getUserDataByUserName(username)) as AdminUser;
      if (user.role !== "admin") {
        throw UserIsNotAdminException;
      }

      // Se as credenciais forem válidas, retorna sucesso.
      res.status(200);
      res.json({
        type: "loginSuccess",
        content: {
          username: username,
          role: "admin",
          clientTempId: clientTempId,
        },
      });

      // Atualiza o identificador do fliperama.
      const id = user.arcades[0]; // TODO: Tratamento para quando o usuário tiver mais de um fliperama. (arcades.length > 1)
      updateArcadeIdentifier(id, clientTempId);
    } else {
      // Se as credenciais não forem válidas, retorna erro.
      res.status(401).json({
        type: "arcadeLoginError",
        content: "Credenciais inválidas.",
      });
    }
  } catch (error: any) {
    res.status(error.statusCode);
    res.json({
      type: "arcadeLoginError",
      content: error.message,
    });
  }
}

export function generateLoginPage(req: Request, res: Response) {
  const clientId = parseInt(req.params.clientId);
  console.log(`Redirecionando para ${pageUrl}/login/${clientId}`);
  res.redirect(`${pageUrl}/login/${clientId}`);
}
