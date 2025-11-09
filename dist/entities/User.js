"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
let User = class User {
};
exports.User = User;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }) // Usuário deve ser único
    ,
    tslib_1.__metadata("design:type", String)
], User.prototype, "username", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }) // Email deve ser único
    ,
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "arcades", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => Player_1.Player, (player) => player.user, {
        cascade: true, // Se um User for criado, um Player também será (útil)
    }),
    tslib_1.__metadata("design:type", Player_1.Player)
], User.prototype, "player", void 0);
exports.User = User = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=User.js.map