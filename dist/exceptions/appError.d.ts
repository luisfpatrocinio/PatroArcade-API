declare class AppError extends Error {
    statusCode: number;
    constructor(message?: string, statusCode?: number);
}
export declare class PlayerNotFoundError extends AppError {
    constructor();
}
export declare class PlayerHasNoSavesError extends AppError {
    constructor();
}
export default AppError;
