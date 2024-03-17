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
exports.updateMenu = void 0;
var elysia_1 = require("elysia");
var authentication_1 = require("../authentication");
var connection_1 = require("@/db/connection");
var schema_1 = require("@/db/schema");
var drizzle_orm_1 = require("drizzle-orm");
var productSchema = elysia_1.t.Object({
    id: elysia_1.t.Optional(elysia_1.t.String()),
    name: elysia_1.t.String(),
    description: elysia_1.t.Optional(elysia_1.t.String()),
    price: elysia_1.t.Number({ minimum: 0 }),
});
exports.updateMenu = new elysia_1.default().use(authentication_1.authentication).put('/menu', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var restaurantId, _c, deletedProductIds, newOrUpdatedProducts, updatedProducts, newProducts;
    var getManagedRestaurantId = _b.getManagedRestaurantId, set = _b.set, body = _b.body;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, getManagedRestaurantId()];
            case 1:
                restaurantId = _d.sent();
                _c = body.products, deletedProductIds = _c.deletedProductIds, newOrUpdatedProducts = _c.newOrUpdatedProducts;
                if (!(deletedProductIds.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, connection_1.db
                        .delete(schema_1.products)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.products.id, deletedProductIds), (0, drizzle_orm_1.eq)(schema_1.products.restaurantId, restaurantId)))];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                updatedProducts = newOrUpdatedProducts.filter(function (product) {
                    return !!product.id;
                });
                if (!(updatedProducts.length > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, Promise.all(updatedProducts.map(function (product) {
                        return connection_1.db
                            .update(schema_1.products)
                            .set({
                            name: product.name,
                            description: product.description,
                            priceInCents: product.price * 100,
                        })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.products.id, product.id), (0, drizzle_orm_1.eq)(schema_1.products.restaurantId, restaurantId)));
                    }))];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                newProducts = newOrUpdatedProducts.filter(function (product) {
                    return !product.id;
                });
                if (!newProducts.length) return [3 /*break*/, 7];
                return [4 /*yield*/, connection_1.db.insert(schema_1.products).values(newProducts.map(function (product) {
                        return {
                            name: product.name,
                            description: product.description,
                            priceInCents: product.price * 100,
                            restaurantId: restaurantId,
                        };
                    }))];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                set.status = 204;
                return [2 /*return*/];
        }
    });
}); }, {
    body: elysia_1.t.Object({
        products: elysia_1.t.Object({
            newOrUpdatedProducts: elysia_1.t.Array(productSchema),
            deletedProductIds: elysia_1.t.Array(elysia_1.t.String()),
        }),
    }),
});
