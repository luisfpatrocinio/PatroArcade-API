"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHasNoSavesError = exports.PlayerNotFoundError = void 0;
// exceptions/AppError.ts
class AppError extends Error {
    constructor(message = "An application error occurred", statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, AppError.prototype); // Corrige a cadeia de protótipos
    }
}
class PlayerNotFoundError extends AppError {
    constructor() {
        super("Player not found", 404);
    }
}
exports.PlayerNotFoundError = PlayerNotFoundError;
class PlayerHasNoSavesError extends AppError {
    constructor() {
        super("Player has no saves", 404);
    }
}
exports.PlayerHasNoSavesError = PlayerHasNoSavesError;
exports.default = AppError;
//# sourceMappingURL=appError.js.map