import { ClientFullException } from "../exceptions/loginExceptions";
import { clients } from "../main";
import { AppDataSource } from "../data-source"; 
import { User } from "../entities/User"; 
import { Player } from "../entities/Player"; 
import { getClientById } from "./clientService";
import bcrypt from "bcrypt";

// Criar "Repositórios" (nossa porta de entrada para as tabelas)
const userRepository = AppDataSource.getRepository(User);
const playerRepository = AppDataSource.getRepository(Player);

// Função que verifica se as credenciais são válidas
export async function checkCredentials(
  username: string,
  passwordFromReq: string
): Promise<boolean> {
  // Buscamos no banco o usuário pelo username
  const user = await userRepository.findOne({
    where: { username: username },
  });

  // Se o usuário não existir, retorne false
  if (!user) {
    return false;
  }

  // Compara a senha da requisição com o HASH salvo no banco
  try {
    const isMatch = await bcrypt.compare(passwordFromReq, user.password);
    return isMatch;
  } catch (error) {
    console.error("Erro ao comparar senhas:", error);
    return false;
  }
}

export async function getUserDataByUserName(username: string): Promise<User> {
  const user = await userRepository.findOne({
    where: { username: username },
  });

  if (!user) {
    throw new Error(`User com username ${username} não encontrado`);
  }
  return user;
}

export async function getUserDataByEmail(email: string): Promise<User> {
  const user = await userRepository.findOne({ where: { email: email } });
  if (!user) {
    throw new Error(`User com email ${email} não encontrado`);
  }
  return user;
}

export async function addUserToDatabase(
  user: Partial<User> // O user que vem do controller (username, email, password HASHED)
): Promise<User> {
  console.log("Adicionando usuário ao banco de dados...");

  // Criamos uma instância da Entidade
  const newUser = new User();
  newUser.username = user.username!;
  newUser.email = user.email!;
  newUser.password = user.password!; // O controller já deve mandar o HASH
  newUser.role = "player"; // Novos usuários são sempre "player" por padrão
  newUser.arcades = null; // Definir como null por padrão

  // Salvamos a entidade no banco
  try {
    const savedUser = await userRepository.save(newUser);
    console.log(`Usuário ${savedUser.username} adicionado com sucesso!`);
    return savedUser;
  } catch (error: any) {
    // Tratamento de erro (ex: username ou email duplicado)
    if (error.code === "SQLITE_CONSTRAINT") {
      if (error.message.includes("username")) {
        throw new Error("Este nome de usuário já está em uso.");
      }
      if (error.message.includes("email")) {
        throw new Error("Este email já está em uso.");
      }
    }
    console.error("Erro ao salvar novo usuário:", error);
    throw new Error("Erro ao registrar usuário.");
  }
}

// Esta função não mexe com o banco de dados, então pode ficar síncrona
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

// Esta função também não mexe com o banco de dados
export function isClientFull(clientId: number): boolean {
  var _client = getClientById(clientId);
  if (!_client) {
    throw new ClientFullException();
  }

  return _client.players.length >= 2;
}

export async function userHasPlayer(userId: number): Promise<boolean> {
  // 8. Agora consultamos a tabela Player pela relação com o User
  const player = await playerRepository.findOne({
    where: {
      user: { id: userId }, // É assim que se consulta pela ID de uma relação
    },
  });
  return !!player; // Retorna true se encontrar um player, false se não
}