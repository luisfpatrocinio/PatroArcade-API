"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const tslib_1 = require("tslib");
const express_rate_limit_1 = tslib_1.__importDefault(require("express-rate-limit"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Muitas requisições do mesmo IP. Tente novamente mais tarde."
});
//# sourceMappingURL=rateLimit.js.map