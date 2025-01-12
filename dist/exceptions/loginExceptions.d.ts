import AppError from "./appError";
declare class LoginException extends AppError {
    constructor(message?: string, statusCode?: number);
}
/**
 * Exceção para quando o jogador já está conectado em um fliperama
 */
declare class AlreadyConnectedException extends LoginException {
    constructor();
}
/**
 * Exceção para quando o fliperama já está com a quantidade máxima de jogadores conectados
 */
declare class ClientFullException extends LoginException {
    constructor();
}
declare class ClientNotFoundException extends LoginException {
    constructor();
}
declare class UserIsNotAdminException extends LoginException {
    constructor();
}
export { LoginException, AlreadyConnectedException, ClientFullException, ClientNotFoundException, UserIsNotAdminException, };
