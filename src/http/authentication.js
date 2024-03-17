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
exports.authentication = void 0;
var elysia_1 = require("elysia");
var cookie_1 = require("@elysiajs/cookie");
var jwt_1 = require("@elysiajs/jwt");
var env_1 = require("@/env");
var unauthorized_error_1 = require("./routes/errors/unauthorized-error");
var not_a_manager_error_1 = require("./routes/errors/not-a-manager-error");
var jwtPayloadSchema = elysia_1.t.Object({
    sub: elysia_1.t.String(),
    restaurantId: elysia_1.t.Optional(elysia_1.t.String()),
});
exports.authentication = new elysia_1.default()
    .error({
    UNAUTHORIZED: unauthorized_error_1.UnauthorizedError,
    NOT_A_MANAGER: not_a_manager_error_1.NotAManagerError,
})
    .onError(function (_a) {
    var code = _a.code, error = _a.error, set = _a.set;
    switch (code) {
        case 'UNAUTHORIZED':
            set.status = 401;
            return { code: code, message: error.message };
        case 'NOT_A_MANAGER':
            set.status = 401;
            return { code: code, message: error.message };
    }
})
    .use((0, jwt_1.default)({
    name: 'jwt',
    secret: env_1.env.JWT_SECRET_KEY,
    schema: jwtPayloadSchema,
}))
    .use((0, cookie_1.default)())
    .derive(function (_a) {
    var jwt = _a.jwt, cookie = _a.cookie, setCookie = _a.setCookie, removeCookie = _a.removeCookie;
    return {
        getCurrentUser: function () { return __awaiter(void 0, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jwt.verify(cookie.auth)];
                    case 1:
                        payload = _a.sent();
                        if (!payload) {
                            throw new unauthorized_error_1.UnauthorizedError();
                        }
                        return [2 /*return*/, payload];
                }
            });
        }); },
        signUser: function (payload) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = setCookie;
                        _b = ['auth'];
                        return [4 /*yield*/, jwt.sign(payload)];
                    case 1:
                        _a.apply(void 0, _b.concat([_c.sent(), {
                                httpOnly: true,
                                maxAge: 7 * 86400,
                                path: '/',
                            }]));
                        return [2 /*return*/];
                }
            });
        }); },
        signOut: function () {
            removeCookie('auth');
        },
    };
})
    .derive(function (_a) {
    var getCurrentUser = _a.getCurrentUser;
    return {
        getManagedRestaurantId: function () { return __awaiter(void 0, void 0, void 0, function () {
            var restaurantId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getCurrentUser()];
                    case 1:
                        restaurantId = (_a.sent()).restaurantId;
                        if (!restaurantId) {
                            throw new not_a_manager_error_1.NotAManagerError();
                        }
                        return [2 /*return*/, restaurantId];
                }
            });
        }); },
    };
});
