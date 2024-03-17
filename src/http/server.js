"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var elysia_1 = require("elysia");
var cors_1 = require("@elysiajs/cors");
var register_restaurant_1 = require("./routes/register-restaurant");
var register_customer_1 = require("./routes/register-customer");
var send_authentication_link_1 = require("./routes/send-authentication-link");
var create_order_1 = require("./routes/create-order");
var approve_order_1 = require("./routes/approve-order");
var cancel_order_1 = require("./routes/cancel-order");
var get_orders_1 = require("./routes/get-orders");
var create_evaluation_1 = require("./routes/create-evaluation");
var get_evaluations_1 = require("./routes/get-evaluations");
var update_menu_1 = require("./routes/update-menu");
var update_profile_1 = require("./routes/update-profile");
var authentication_1 = require("./authentication");
var get_profile_1 = require("./routes/get-profile");
var authenticate_from_link_1 = require("./routes/authenticate-from-link");
var get_managed_restaurant_1 = require("./routes/get-managed-restaurant");
var sign_out_1 = require("./routes/sign-out");
var get_order_details_1 = require("./routes/get-order-details");
var get_month_receipt_1 = require("./routes/get-month-receipt");
var get_month_orders_amount_1 = require("./routes/get-month-orders-amount");
var get_day_orders_amount_1 = require("./routes/get-day-orders-amount");
var get_month_canceled_orders_amount_1 = require("./routes/get-month-canceled-orders-amount");
var get_daily_receipt_in_period_1 = require("./routes/get-daily-receipt-in-period");
var get_popular_products_1 = require("./routes/get-popular-products");
var dispatch_order_1 = require("./routes/dispatch-order");
var deliver_order_1 = require("./routes/deliver-order");
var app = new elysia_1.Elysia()
    .use((0, cors_1.cors)({
    credentials: true,
    allowedHeaders: ['content-type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    origin: function (request) {
        var origin = request.headers.get('origin');
        if (!origin) {
            return false;
        }
        return true;
    },
}))
    .use(authentication_1.authentication)
    .use(sign_out_1.signOut)
    .use(get_profile_1.getProfile)
    .use(get_managed_restaurant_1.getManagedRestaurant)
    .use(register_restaurant_1.registerRestaurant)
    .use(register_customer_1.registerCustomer)
    .use(send_authentication_link_1.sendAuthenticationLink)
    .use(authenticate_from_link_1.authenticateFromLink)
    .use(create_order_1.createOrder)
    .use(approve_order_1.approveOrder)
    .use(cancel_order_1.cancelOrder)
    .use(dispatch_order_1.dispatchOrder)
    .use(deliver_order_1.deliverOrder)
    .use(get_orders_1.getOrders)
    .use(get_order_details_1.getOrderDetails)
    .use(create_evaluation_1.createEvaluation)
    .use(get_evaluations_1.getEvaluations)
    .use(update_menu_1.updateMenu)
    .use(update_profile_1.updateProfile)
    .use(get_month_receipt_1.getMonthReceipt)
    .use(get_month_orders_amount_1.getMonthOrdersAmount)
    .use(get_day_orders_amount_1.getDayOrdersAmount)
    .use(get_month_canceled_orders_amount_1.getMonthCanceledOrdersAmount)
    .use(get_daily_receipt_in_period_1.getDailyReceiptInPeriod)
    .use(get_popular_products_1.getPopularProducts);
app.listen(3333);
console.log("\uD83D\uDD25 HTTP server running at ".concat((_a = app.server) === null || _a === void 0 ? void 0 : _a.hostname, ":").concat((_b = app.server) === null || _b === void 0 ? void 0 : _b.port));
