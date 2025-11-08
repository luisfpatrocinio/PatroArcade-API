import { ClientFullException } from "../exceptions/loginExceptions";
import { clients } from "../main";
import { playerDatabase } from "../models/playerDatabase";
import { User, AdminUser, usersDatabase } from "../models/userModel";
import { getClientById } from "./clientService";
import bcrypt from "bcrypt";

// Função que verifica se as credenciais são válidas
export async function checkCredentials(
  username: string,
  passwordFromReq: string
): Promise<boolean> {

  // Primeiro, encontre o usuário (de forma síncrona, já que é um array em memória)
  const user = usersDatabase.find((u) => u.username === username);

  // Se o usuário não existir, retorne false
  if (!user) {
    return false;
  }

  // Se o usuário existir, compare a senha da requisição com o HASH salvo
  // A função bcrypt.compare faz a mágica de forma segura e assíncrona.
  try {
    const isMatch = await bcrypt.compare(passwordFromReq, user.password);
    return isMatch;
  } catch (error) {
    console.error("Erro ao comparar senhas:", error);
    return false;
  }
}

export function getUserDataByUserName(username: string): User | AdminUser {
  const user = usersDatabase.find((u) => u.username === username);
  if (!user) {
    throw new Error(`User with username ${username} not found`);
  }
  return user;
}

export function getUserDataByEmail(email: string): User | AdminUser {
  const user = usersDatabase.find((u) => u.email === email);
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }
  return user;
}

export function addUserToDatabase(user: Partial<User>): User {
  console.log("Adicionando usuário ao banco de dados...");
  const newUser: User = {
    id: usersDatabase.length + 1, // ID é incremental e começa no 1
    username: user.username!,
    password: user.password!,
    email: user.email!,
    role: "player", // Novos usuários são sempre "player" por padrão
  };
  usersDatabase.push(newUser);
  console.log(`Usuário ${newUser.username} adicionado com sucesso!`);
  return newUser;
}

export function isAlreadyConnected(userId: number): boolean {
  let _connected = false;
  // Percorre todos os clientes
  clients.forEach((client) => {
    // Confere se há um player com o mesmo id do userId
    if (client.players.includes(userId)) {
      _connected = true;
    }
  });
  return _connected;
}

export function isClientFull(clientId: number): boolean {
  // Percorre todas as chaves do mapa clients, conferindo se o valor de id é igual ao clientId:
  var _client = getClientById(clientId);
  if (!_client) {
    throw new ClientFullException();
  }

  return _client.players.length >= 2;
}

export function userHasPlayer(userId: number): boolean {
  // Percorre todos os players, conferindo se há um player com o mesmo userId
  const players = playerDatabase; // Database de players
  return players.some((player) => player.userId === userId);
}
