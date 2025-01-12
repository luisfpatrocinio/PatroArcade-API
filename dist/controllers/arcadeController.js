"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchArcadeInfoById = void 0;
const arcadeService_1 = require("../services/arcadeService");
const fetchArcadeInfoById = (req, res) => {
    const arcadeId = Number(req.params.arcadeId);
    console.log("Obtendo arcade: ", arcadeId);
    try {
        const arcadeData = (0, arcadeService_1.getArcadeInfoById)(arcadeId);
        res.status(200).json({ type: "arcadeData", content: arcadeData });
    }
    catch (error) {
        console.log(`Arcade de ID ${arcadeId} não encontrado.`);
        res.status(404).json({ type: "arcadeData", content: null });
    }
};
exports.fetchArcadeInfoById = fetchArcadeInfoById;
//# sourceMappingURL=arcadeController.js.map