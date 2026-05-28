// exceptions/AppError.ts
class AppError extends Error {
  public statusCode: number;

  constructor(
    message: string = "An application error occurred",
    statusCode: number = 500
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AppError.prototype); // Corrige a cadeia de protótipos
  }
}

export class PlayerNotFoundError extends AppError {
  constructor() {
    super("Player not found", 404);
  }
}

export class PlayerHasNoSavesError extends AppError {
  constructor() {
    super("Player has no saves", 404);
  }
}

export class AntiCheatError extends AppError {
  constructor(message: string = "Score excedeu o máximo de pontos logicamente permissivos para a duração baseada na sessão.") {
    super(message, 400);
  }
}

export default AppError;
