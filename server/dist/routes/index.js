"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("../modules/users/user.route"));
const admin_route_1 = __importDefault(require("../modules/admin/admin.route"));
const vendor_route_1 = __importDefault(require("../modules/vendor/vendor.route"));
const router = express_1.default.Router();
router.use('/user', user_route_1.default);
router.use('/admin', admin_route_1.default);
router.use('/vendor', vendor_route_1.default);
exports.default = router;
