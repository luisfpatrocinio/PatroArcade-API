export declare function clientExists(clientId: number): boolean;
export declare function getClientById(clientId: number): any;
export declare function sendWebSocketMessage(clientId: number, type: string, content: any): void;
export declare function addPlayerToClient(clientId: number, userId: number): void;
