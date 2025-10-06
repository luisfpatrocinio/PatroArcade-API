import { Request, Response } from "express";
import { findSaveData, generateNewSave } from "../services/saveService";
import { saveDatabase } from "../models/saveData";
import { updatePlayerTotalScore } from "../services/playerService";

// Função auxiliar "inteligente" para descobrir qual ID usar
function getRelevantPlayerId(req: Request): number {
  // Se a rota tem um :playerId (ex: /save/123/1), é uma requisição de admin. Usa ele.
  // Senão (ex: /save/me/1), é uma requisição de jogador. Usa o ID do token.
  return req.params.playerId ? Number(req.params.playerId) : req.user!.userId;
}

export function getPlayerSaveData(req: Request, res: Response) {
  const playerId = getRelevantPlayerId(req);
  const gameId = Number(req.params.gameId);

  try {
    console.log("[getPlayerSaveData] Solicitando dados salvos...");
    const save = findSaveData(playerId, gameId);
    return res.status(200).json({ type: "playerSave", content: save });
  } catch (err) {
    console.error(
      "[findSaveData]\t Erro ao obter dados de save: ",
      (err as Error).message
    );
    return res.status(404).json({
      type: "playerSaveFailed",
      content: generateNewSave(playerId, gameId),
    });
  }
}

export function getSaveDatas(req: Request, res: Response) {
  console.log("Obtendo todos os dados salvos.");
  const saves = saveDatabase;
  return res.status(200).json({ type: "allSaves", content: saves });
}

// Função que recebe dados do jogador do jogo e atualiza no banco de dados.
// Esta função só é chamada pela rota /me:gameId.
// Portanto, o playerId VEM APENAS do token. É 100% seguro.
export async function savePlayerData(req: Request, res: Response) {
  const playerId = req.user!.userId;
  const gameId = Number(req.params.gameId);
  const data = req.body;

  try {
    // Localiza o save do jogador no banco de dados
    const saveIndex = saveDatabase.findIndex(
      (save) => save.playerId === playerId && save.gameId === gameId
    );

    // Ao encontrar:
    if (saveIndex !== -1) {
      saveDatabase[saveIndex] = {
        ...saveDatabase[saveIndex],
        data,
        lastPlayed: new Date(),
      };
      console.log(
        `[savePlayerData] Player: ${playerId} Game: ${gameId} - SUCESSO`
      );
      updatePlayerTotalScore(playerId);
      return res.status(200).json({
        type: "playerSaveUpdated",
        content: "Dados de save atualizados com sucesso.",
      });
    }

    // Primeira vez que o jogador salva dados
    saveDatabase.push({
      gameId,
      playerId,
      richPresenceText: "Jogando...",
      data,
      lastPlayed: new Date(),
    });
    console.log(
      `[savePlayerData] Player: ${playerId} Game: ${gameId} - CRIADO`
    );
    return res.status(201).json({
      type: "playerSaveCreated",
      content: "Dados de save criados com sucesso.",
    });
  } catch (err) {
    console.log(
      `[savePlayerData] Player: ${playerId} Game: ${gameId} - ERRO: ${
        (err as Error).message
      }`
    );
    return res.status(500).json({
      type: "playerSaveFailed",
      content: "Erro ao salvar dados de save.",
    });
  }
}

// Função que vai receber o texto do Rich Presence e atualizar no banco de dados.
export function updateRichPresence(req: Request, res: Response) {
  const playerId = req.user!.userId;
  const gameId = Number(req.params.gameId);
  const richPresenceText = req.body.richPresenceText;

  try {
    console.log(
      `[updateRichPresence] Atualizando Rich Presence para Player: ${playerId} Game: ${gameId}`
    );
    // Atualizar o banco de dados com o novo texto do Rich Presence
    // Localiza o save do jogador no banco de dados
    const saveIndex = saveDatabase.findIndex(
      (save) => save.playerId === playerId && save.gameId === gameId
    );

    // Ao encontrar:
    if (saveIndex !== -1) {
      saveDatabase[saveIndex] = {
        ...saveDatabase[saveIndex],
        richPresenceText,
      };
      console.log(
        `[updateRichPresence] Player: ${playerId} Game: ${gameId} - SUCESSO`
      );
      return res.status(200).json({
        type: "richPresenceUpdated",
        content: "Rich Presence atualizado com sucesso.",
      });
    }

    // Primeira vez que o jogador salva dados
    saveDatabase.push({
      gameId,
      playerId,
      richPresenceText,
      data: {},
      lastPlayed: new Date(),
    });
    console.log(
      `[updateRichPresence] Player: ${playerId} Game: ${gameId} - CRIADO`
    );
    return res.status(201).json({
      type: "richPresenceCreated",
      content: "Rich Presence criado com sucesso.",
    });
  } catch (err) {
    console.error(
      `[updateRichPresence] Player: ${playerId} Game: ${gameId} - ERRO: ${
        (err as Error).message
      }`
    );
    return res.status(500).json({
      type: "richPresenceFailed",
      content: "Erro ao atualizar Rich Presence.",
    });
  }
}
