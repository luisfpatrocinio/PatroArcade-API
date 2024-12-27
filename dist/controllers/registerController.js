"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const userService_1 = require("../services/userService");
const appError_1 = __importDefault(require("../exceptions/appError"));
const playerService_1 = require("../services/playerService");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Vai chegar um json com os dados do usuário
        console.log("Registrando usuário...");
        console.log(req.body);
        const { username, email, password, confirmPassword } = req.body;
        try {
            // Verificar se as senhas são iguais
            if (password !== confirmPassword) {
                throw new appError_1.default("As senhas não coincidem.", 400);
            }
            // Verificar se o usuário já existe
            let userExists;
            try {
                userExists = (0, userService_1.getUserDataByUserName)(username);
            }
            catch (error) {
                userExists = null;
            }
            if (userExists) {
                throw new appError_1.default("Usuário já existe.", 400);
            }
            // Verificar se o email já existe
            let emailExists;
            try {
                emailExists = (0, userService_1.getUserDataByUserName)(email);
            }
            catch (error) {
                emailExists = null;
            }
            if (emailExists) {
                throw new appError_1.default("Email já existe.", 400);
            }
            // Se tudo estiver ok, criar o usuário
            const newUser = {
                username,
                email,
                password,
            };
            // Adicionar o usuário ao banco de dados
            const newUserAdded = (0, userService_1.addUserToDatabase)(newUser);
            // Criar um jogador para o usuário
            (0, playerService_1.createPlayerForUser)(newUserAdded);
            console.log(`Usuário ${username} registrado com sucesso.`);
            res.status(200).json({ type: "registerSuccess", content: req.body });
        }
        catch (error) {
            console.log(`Erro ao registrar usuário: ${error.message}`);
            if (error instanceof appError_1.default) {
                res.status(error.statusCode).json({
                    type: "registerFailed",
                    content: error.message,
                });
            }
        }
    });
}
exports.registerUser = registerUser;
