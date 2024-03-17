"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvaluations = void 0;
var connection_1 = require("@/db/connection");
var elysia_1 = require("elysia");
var zod_1 = require("zod");
var authentication_1 = require("../authentication");
exports.getEvaluations = new elysia_1.default().use(authentication_1.authentication).get('/evaluations', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var restaurantId, pageIndex, evaluations;
    var query = _b.query, set = _b.set, getCurrentUser = _b.getCurrentUser;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, getCurrentUser()];
            case 1:
                restaurantId = (_c.sent()).restaurantId;
                if (!restaurantId) {
                    set.status = 401;
                    throw new Error('User is not a restaurant manager.');
                }
                pageIndex = zod_1.z
                    .object({
                    pageIndex: zod_1.z.coerce.number().default(0),
                })
                    .parse(query).pageIndex;
                return [4 /*yield*/, connection_1.db.query.evaluations.findMany({
                        offset: pageIndex * 10,
                        limit: 10,
                        orderBy: function (evaluations, _a) {
                            var desc = _a.desc;
                            return desc(evaluations.createdAt);
                        },
                    })];
            case 2:
                evaluations = _c.sent();
                return [2 /*return*/, evaluations];
        }
    });
}); }, {
    query: elysia_1.t.Object({
        pageIndex: elysia_1.t.Numeric({ minimum: 0 }),
    }),
});
