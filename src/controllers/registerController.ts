import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  addUserToDatabase,
  getUserDataByUserName,
  getUserDataByEmail, // Importei a função correta para checar email
} from "../services/userService";
import AppError from "../exceptions/appError";
import { createPlayerForUser } from "../services/playerService";
import bcrypt from "bcrypt"; // Importar bcrypt para o HASH

export async function registerUser(req: Request, res: Response) {
  // Adicionar verificação de erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Se houver erros, retorna 400 com a lista de erros
    return res
      .status(400)
      .json({ type: "registerFailed", content: errors.array() });
  }

  console.log("Registrando usuário...");
  const { username, email, password, confirmPassword } = req.body;

  try {
    // 1. Validar senhas
    if (password !== confirmPassword) {
      throw new AppError("As senhas não coincidem.", 400);
    }

    // 2. Verificar se o usuário já existe (agora com await)
    let userExists = null;
    try {
      userExists = await getUserDataByUserName(username);
    } catch (error) {
      userExists = null; // O serviço lança erro se não encontrar, então pegamos
    }
    if (userExists) {
      throw new AppError("Usuário já existe.", 400);
    }

    // 3. Verificar se o email já existe (agora com await)
    let emailExists = null;
    try {
      emailExists = await getUserDataByEmail(email);
    } catch (error) {
      emailExists = null;
    }
    if (emailExists) {
      throw new AppError("Email já existe.", 400);
    }

    // 4. Criar o HASH da senha (como no Passo 1)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Criar o objeto de usuário parcial
    const newUserPartial = {
      username,
      email,
      password: hashedPassword, // Salva o HASH
    };

    // 6. Adicionar o usuário ao banco (agora com await)
    const newUserAdded = await addUserToDatabase(newUserPartial);

    // 7. Criar um jogador para o usuário (agora com await)
    await createPlayerForUser(newUserAdded);

    console.log(`Usuário ${username} registrado com sucesso.`);
    res.status(201).json({
      type: "registerSuccess",
      content: "Usuário criado com sucesso.",
    });
  } catch (error: any) {
    console.log(`Erro ao registrar usuário: ${error.message}`);

    // O service agora pode lançar erros (ex: email duplicado)
    if (error.message.includes("email") || error.message.includes("usuário")) {
      return res.status(400).json({
        type: "registerFailed",
        content: error.message,
      });
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        type: "registerFailed",
        content: error.message,
      });
    } else {
      res.status(500).json({
        type: "registerFailed",
        content: "Erro interno no servidor.",
      });
    }
  }
}
