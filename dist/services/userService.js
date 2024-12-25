"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClientFull = exports.isAlreadyConnected = exports.addUserToDatabase = exports.getUserDataByEmail = exports.getUserDataByUserName = exports.checkCredentials = void 0;
const loginExceptions_1 = require("../exceptions/loginExceptions");
const main_1 = require("../main");
const usersDatabase_1 = require("../models/usersDatabase");
const clientService_1 = require("./clientService");
// Função que verifica se as credenciais são válidas
function checkCredentials(username, password) {
    const user = usersDatabase_1.usersDatabase.find((u) => u.username === username && u.password === password);
    return !!user; // Retorna true se o usuário for encontrado, false caso contrário
}
exports.checkCredentials = checkCredentials;
function getUserDataByUserName(username) {
    const user = usersDatabase_1.usersDatabase.find((u) => u.username === username);
    if (!user) {
        throw new Error(`User with username ${username} not found`);
    }
    return user;
}
exports.getUserDataByUserName = getUserDataByUserName;
function getUserDataByEmail(email) {
    const user = usersDatabase_1.usersDatabase.find((u) => u.email === email);
    if (!user) {
        throw new Error(`User with email ${email} not found`);
    }
    return user;
}
exports.getUserDataByEmail = getUserDataByEmail;
function addUserToDatabase(user) {
    console.log("Adicionando usuário ao banco de dados...");
    const newUser = {
        id: usersDatabase_1.usersDatabase.length + 1,
        username: user.username,
        password: user.password,
        email: user.email,
        role: "player",
    };
    usersDatabase_1.usersDatabase.push(newUser);
    console.log(`Usuário ${newUser.username} adicionado com sucesso!`);
    return newUser;
}
exports.addUserToDatabase = addUserToDatabase;
function isAlreadyConnected(userId) {
    let _connected = false;
    // Percorre todos os clientes
    main_1.clients.forEach((client) => {
        // Confere se há um player com o mesmo id do userId
        if (client.players.includes(userId)) {
            _connected = true;
        }
    });
    return _connected;
}
exports.isAlreadyConnected = isAlreadyConnected;
function isClientFull(clientId) {
    // Percorre todas as chaves do mapa clients, conferindo se o valor de id é igual ao clientId:
    var _client = (0, clientService_1.getClientById)(clientId);
    if (!_client) {
        throw new loginExceptions_1.ClientFullException();
    }
    return _client.players.length >= 2;
}
exports.isClientFull = isClientFull;
