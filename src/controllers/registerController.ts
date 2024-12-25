import { Request, Response } from "express";
import {
  addUserToDatabase,
  getUserDataByUserName,
} from "../services/userService";
import AppError from "../exceptions/appError";

export function registerUser(req: Request, res: Response) {
  // Vai chegar um json com os dados do usuário
  console.log("Registrando usuário...");
  console.log(req.body);

  const { username, email, password, confirmPassword } = req.body;

  try {
    // Verificar se as senhas são iguais
    if (password !== confirmPassword) {
      throw new AppError("As senhas não coincidem.", 400);
    }

    // Verificar se o usuário já existe
    let userExists;
    try {
      userExists = getUserDataByUserName(username);
    } catch (error) {
      userExists = null;
    }
    if (userExists) {
      throw new AppError("Usuário já existe.", 400);
    }

    // Verificar se o email já existe
    let emailExists;
    try {
      emailExists = getUserDataByUserName(email);
    } catch (error) {
      emailExists = null;
    }
    if (emailExists) {
      throw new AppError("Email já existe.", 400);
    }

    // Se tudo estiver ok, criar o usuário
    const newUser = {
      username,
      email,
      password,
    };

    // Adicionar o usuário ao banco de dados
    addUserToDatabase(newUser);

    // Cria um player para esse usuário
    // createPlayer(newUser.username

    console.log(`Usuário ${username} registrado com sucesso.`);

    res.status(200).json({ type: "registerSuccess", content: req.body });
  } catch (error) {
    console.log(`Erro ao registrar usuário: ${(error as Error).message}`);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        type: "registerFailed",
        content: error.message,
      });
    }
  }
}
