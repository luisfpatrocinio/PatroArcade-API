"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArcade = exports.arcadeDatabase = void 0;
exports.arcadeDatabase = [
    {
        id: 1,
        name: "Arcade Primeiro",
        description: "O primeiro arcade do sistema.",
    },
];
function createArcade(arcade) {
    exports.arcadeDatabase.push(arcade);
}
exports.createArcade = createArcade;
//# sourceMappingURL=arcadeInfo.js.map