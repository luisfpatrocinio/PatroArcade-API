import { ArcadeInfo } from "../models/arcadeInfo";
import { User } from "../models/userModel";
export declare function updateArcadeIdentifier(id: number, clientTempId: string): void;
export declare function getArcadeInfoById(arcadeId: number): ArcadeInfo;
/**
 * Desconecta todos os jogadores associados a um determinado fliperama.
 * @param arcadeId O ID do fliperama.
 * @returns Um array com os dados dos jogadores que foram desconectados.
 */
export declare function disconnectArcadePlayers(arcadeId: number): User[];
