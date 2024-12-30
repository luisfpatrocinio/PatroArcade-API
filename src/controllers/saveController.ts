import { Request, Response } from "express";
import { findSaveData } from "../services/saveService";
import { saveDatabase } from "../models/saveData";
import { updatePlayerTotalScore } from "../services/playerService";

export function getPlayerSaveData(req: Request, res: Response) {
  console.log("[getPlayerSaveData] Solicitando dados salvos...");

  const playerId = Number(req.params.playerId);
  const gameId = Number(req.params.gameId);

  // Consultar o banco de dados para obter os dados salvos do jogador
  try {
    const save = findSaveData(playerId, gameId);
    return res.status(200).json({ type: "playerSave", content: save });
  } catch (err) {
    console.error("Erro ao obter dados de save: ", (err as Error).message);
    return res.status(404).json({
      type: "playerSaveFailed",
      content: "Erro ao obter dados de save.",
    });
  } finally {
    console.log("[getPlayerSaveData] Solicitação de dados de save finalizada.");
  }
}

export function getSaveDatas(req: Request, res: Response) {
  console.log("Obtendo todos os dados salvos.");

  const saves = saveDatabase;
  return res.status(200).json({ type: "allSaves", content: saves });
}

// Função que recebe dados do jogador do jogo e atualiza no banco de dados.
export async function savePlayerData(req: Request, res: Response) {
  console.log("[savePlayerData] Recebendo save do jogador...");

  const playerId = Number(req.params.playerId);
  const gameId = Number(req.params.gameId);
  const data = req.body;

  // Atualizar o banco de dados com os novos dados do jogador
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
      console.log("[savePlayerData] Dados de save atualizados com sucesso.");
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
    console.log("[savePlayerData] Dados de save criados com sucesso.");
    return res.status(201).json({
      type: "playerSaveCreated",
      content: "Dados de save criados com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao salvar dados de save: ", (err as Error).message);
    return res.status(500).json({
      type: "playerSaveFailed",
      content: "Erro ao salvar dados de save.",
    });
  } finally {
    console.log("[savePlayerData] finalizado.");
  }
}

// Função que vai receber o texto do Rich Presence e atualizar no banco de dados.
export function updateRichPresence(req: Request, res: Response) {
  console.log("[updateRichPresence] Atualizando Rich Presence...");

  const playerId = Number(req.params.playerId);
  const gameId = Number(req.params.gameId);
  const richPresenceText = req.body.richPresenceText;

  // Atualizar o banco de dados com o novo texto do Rich Presence
  try {
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
      console.log("[updateRichPresence] Rich Presence atualizado com sucesso.");
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
    console.log("[updateRichPresence] Rich Presence criado com sucesso.");
    return res.status(201).json({
      type: "richPresenceCreated",
      content: "Rich Presence criado com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao atualizar Rich Presence: ", (err as Error).message);
    return res.status(500).json({
      type: "richPresenceFailed",
      content: "Erro ao atualizar Rich Presence.",
    });
  } finally {
    console.log("[updateRichPresence] finalizado.");
  }
}
