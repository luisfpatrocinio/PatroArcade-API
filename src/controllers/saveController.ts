import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  findSaveData,
  generateNewSaveDataShell, // Mudamos o nome da função no service
  getAllSaves,
} from "../services/saveService";
import { updatePlayerTotalScore } from "../services/playerService";
import { AppDataSource } from "../data-source";
import { SaveData } from "../entities/SaveData";
import { Player } from "../entities/Player";
import { Game } from "../entities/Game";

// Repositórios que usaremos para criar/atualizar saves
const saveDataRepository = AppDataSource.getRepository(SaveData);
const playerRepository = AppDataSource.getRepository(Player);
const gameRepository = AppDataSource.getRepository(Game);

// Função auxiliar "inteligente" para descobrir qual ID usar
function getRelevantPlayerId(req: Request): number {
  // Se a rota tem um :playerId (ex: /save/123/1), é uma requisição de admin. Usa ele.
  // Senão (ex: /save/me/1), é uma requisição de jogador. Usa o 'playerId' do token.
  return req.params.playerId ? Number(req.params.playerId) : req.user!.playerId;
}

export async function getPlayerSaveData(req: Request, res: Response) {
  try {
    const playerId = getRelevantPlayerId(req);
    const gameId = Number(req.params.gameId);

    if (isNaN(playerId) || isNaN(gameId)) {
      return res
        .status(400)
        .json({ type: "playerSaveFailed", content: "IDs inválidos." });
    }

    console.log("[getPlayerSaveData] Solicitando dados salvos...");
    const save = await findSaveData(playerId, gameId);
    return res.status(200).json({ type: "playerSave", content: save });
  } catch (err) {
    // Se 'findSaveData' lançou SaveNotFoundError
    console.error(
      "[findSaveData]\t Erro ao obter dados de save: ",
      (err as Error).message
    );
    // Geramos uma "casca" de save para o frontend (não salva no banco)
    return res.status(404).json({
      type: "playerSaveFailed",
      content: generateNewSaveDataShell(
        getRelevantPlayerId(req),
        Number(req.params.gameId)
      ),
    });
  }
}

// Rota de Admin
export async function getSaveDatas(req: Request, res: Response) {
  try {
    console.log("Obtendo todos os dados salvos.");
    const saves = await getAllSaves();
    return res.status(200).json({ type: "allSaves", content: saves });
  } catch (error) {
    console.error("Erro ao buscar todos os saves: ", error);
    return res
      .status(500)
      .json({ type: "error", content: "Erro interno do servidor." });
  }
}

// Rota de Jogador (/me/:gameId) - 100% segura
export async function savePlayerData(req: Request, res: Response) {
  // Verificar erros de validação do express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ type: "playerSaveFailed", content: errors.array() });
  }

  // 1. O ID do Player vem do TOKEN JWT (graças ao authMiddleware)
  const playerId = req.user!.playerId;
  const gameId = Number(req.params.gameId);
  const data = req.body; // O JSON com { highestScore: ..., totalScore: ... }

  if (isNaN(gameId)) {
    return res
      .status(400)
      .json({ type: "playerSaveFailed", content: "Game ID inválido." });
  }

  try {
    // 2. Tenta encontrar o save existente
    let save = await saveDataRepository.findOne({
      where: {
        player: { id: playerId },
        game: { id: gameId },
      },
    });

    // 3. Se não encontrar, cria um NOVO save
    if (!save) {
      console.log(
        `[savePlayerData] CRIANDO save: Player ${playerId}, Game ${gameId}`
      );
      save = new SaveData();

      // Precisamos "anexar" as entidades Player e Game
      const player = await playerRepository.findOneBy({ id: playerId });
      const game = await gameRepository.findOneBy({ id: gameId });

      if (!player || !game) {
        return res.status(404).json({
          type: "playerSaveFailed",
          content: "Jogador ou Jogo não encontrado.",
        });
      }

      save.player = player;
      save.game = game;
      save.richPresenceText = "Jogando pela primeira vez...";
    }

    // 4. Atualiza os dados do save (seja ele novo ou antigo)
    save.data = data;
    save.lastPlayed = new Date(); // Atualiza a data

    // 5. Salva o objeto 'save' no banco
    await saveDataRepository.save(save);

    console.log(`[savePlayerData] SUCESSO: Player ${playerId}, Game ${gameId}`);

    // 6. Atualiza a pontuação total (totalScore) no perfil do Player
    await updatePlayerTotalScore(playerId);

    if (!save) {
      // Se for a primeira vez
      return res.status(201).json({
        // 201 Created
        type: "playerSaveCreated",
        content: "Dados de save criados com sucesso.",
      });
    }

    return res.status(200).json({
      // 200 OK
      type: "playerSaveUpdated",
      content: "Dados de save atualizados com sucesso.",
    });
  } catch (err) {
    console.error(
      `[savePlayerData] ERRO: Player ${playerId}, Game ${gameId} - ${
        (err as Error).message
      }`
    );
    return res.status(500).json({
      type: "playerSaveFailed",
      content: "Erro ao salvar dados de save.",
    });
  }
}

// Rota de Jogador (/me/updateRichPresence/:gameId)
export async function updateRichPresence(req: Request, res: Response) {
  // Adicionar verificação de erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ type: "richPresenceFailed", content: errors.array() });
  }

  const playerId = req.user!.playerId; // ID do Player vindo do Token
  const gameId = Number(req.params.gameId);
  const { richPresenceText } = req.body;

  if (isNaN(gameId)) {
    return res
      .status(400)
      .json({ type: "richPresenceFailed", content: "Game ID inválido." });
  }
  if (!richPresenceText) {
    return res.status(400).json({
      type: "richPresenceFailed",
      content: "richPresenceText é obrigatório.",
    });
  }

  try {
    let save = await saveDataRepository.findOne({
      where: {
        player: { id: playerId },
        game: { id: gameId },
      },
    });

    let statusCode = 200; // OK
    let type = "richPresenceUpdated";
    let content = "Rich Presence atualizado com sucesso.";

    // Se o save não existir, cria um novo
    if (!save) {
      console.log(
        `[updateRichPresence] CRIANDO save: Player ${playerId}, Game ${gameId}`
      );
      save = new SaveData();

      const player = await playerRepository.findOneBy({ id: playerId });
      const game = await gameRepository.findOneBy({ id: gameId });

      if (!player || !game) {
        return res.status(404).json({
          type: "richPresenceFailed",
          content: "Jogador ou Jogo não encontrado.",
        });
      }

      save.player = player;
      save.game = game;
      save.data = {}; // Inicia com dados vazios

      statusCode = 201; // Created
      type = "richPresenceCreated";
      content = "Rich Presence criado com sucesso.";
    }

    // Atualiza o rich presence e salva
    save.richPresenceText = richPresenceText;
    await saveDataRepository.save(save);

    console.log(
      `[updateRichPresence] SUCESSO: Player ${playerId}, Game ${gameId}`
    );

    return res.status(statusCode).json({ type, content });
  } catch (err) {
    console.error(
      `[updateRichPresence] ERRO: Player ${playerId}, Game ${gameId} - ${
        (err as Error).message
      }`
    );
    return res.status(500).json({
      type: "richPresenceFailed",
      content: "Erro ao atualizar Rich Presence.",
    });
  }
}
