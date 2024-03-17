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
exports.createOrder = void 0;
var connection_1 = require("@/db/connection");
var schema_1 = require("@/db/schema");
var elysia_1 = require("elysia");
var authentication_1 = require("../authentication");
var order_items_1 = require("@/db/schema/order-items");
exports.createOrder = new elysia_1.default().use(authentication_1.authentication).post('/restaurants/:restaurantId/orders', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var customerId, restaurantId, items, productsIds, products, orderProducts, totalInCents;
    var params = _b.params, body = _b.body, getCurrentUser = _b.getCurrentUser, set = _b.set;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, getCurrentUser()];
            case 1:
                customerId = (_c.sent()).sub;
                restaurantId = params.restaurantId;
                items = body.items;
                productsIds = items.map(function (item) { return item.productId; });
                return [4 /*yield*/, connection_1.db.query.products.findMany({
                        where: function (fields, _a) {
                            var eq = _a.eq, and = _a.and, inArray = _a.inArray;
                            return and(eq(fields.restaurantId, restaurantId), inArray(fields.id, productsIds));
                        },
                    })];
            case 2:
                products = _c.sent();
                orderProducts = items.map(function (item) {
                    var product = products.find(function (product) { return product.id === item.productId; });
                    if (!product) {
                        throw new Error('Not all products are available in this restaurant.');
                    }
                    return {
                        productId: item.productId,
                        unitPriceInCents: product.priceInCents,
                        quantity: item.quantity,
                        subtotalInCents: item.quantity * product.priceInCents,
                    };
                });
                totalInCents = orderProducts.reduce(function (total, orderItem) {
                    return total + orderItem.subtotalInCents;
                }, 0);
                return [4 /*yield*/, connection_1.db.transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var order;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tx
                                        .insert(schema_1.orders)
                                        .values({
                                        totalInCents: totalInCents,
                                        customerId: customerId,
                                        restaurantId: restaurantId,
                                    })
                                        .returning({
                                        id: schema_1.orders.id,
                                    })];
                                case 1:
                                    order = (_a.sent())[0];
                                    return [4 /*yield*/, tx.insert(order_items_1.orderItems).values(orderProducts.map(function (orderProduct) {
                                            return {
                                                orderId: order.id,
                                                productId: orderProduct.productId,
                                                priceInCents: orderProduct.unitPriceInCents,
                                                quantity: orderProduct.quantity,
                                            };
                                        }))];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _c.sent();
                set.status = 201;
                return [2 /*return*/];
        }
    });
}); }, {
    body: elysia_1.t.Object({
        items: elysia_1.t.Array(elysia_1.t.Object({
            productId: elysia_1.t.String(),
            quantity: elysia_1.t.Integer(),
        })),
    }),
    params: elysia_1.t.Object({
        restaurantId: elysia_1.t.String(),
    }),
});
