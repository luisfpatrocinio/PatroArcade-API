"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIsNotAdminException = exports.ClientNotFoundException = exports.ClientFullException = exports.AlreadyConnectedException = exports.LoginException = void 0;
const tslib_1 = require("tslib");
// exceptions/LoginException.js
const appError_1 = tslib_1.__importDefault(require("./appError"));
class LoginException extends appError_1.default {
    constructor(message = "A login error occurred", statusCode = 500) {
        super(message, statusCode);
    }
}
exports.LoginException = LoginException;
/**
 * Exceção para quando o jogador já está conectado em um fliperama
 */
class AlreadyConnectedException extends LoginException {
    constructor() {
        super("User is already connected", 403);
    }
}
exports.AlreadyConnectedException = AlreadyConnectedException;
/**
 * Exceção para quando o fliperama já está com a quantidade máxima de jogadores conectados
 */
class ClientFullException extends LoginException {
    constructor() {
        super("Client is full", 409);
    }
}
exports.ClientFullException = ClientFullException;
class ClientNotFoundException extends LoginException {
    constructor() {
        super("Client not found", 404);
    }
}
exports.ClientNotFoundException = ClientNotFoundException;
class UserIsNotAdminException extends LoginException {
    constructor() {
        super("User is not an admin", 403);
    }
}
exports.UserIsNotAdminException = UserIsNotAdminException;
//# sourceMappingURL=loginExceptions.js.map