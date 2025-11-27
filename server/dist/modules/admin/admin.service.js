"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardDataService = exports.VerifyToken = exports.AuthenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../users/user.model"));
const category_model_1 = __importDefault(require("../categories/category.model"));
const product_model_1 = __importDefault(require("../products/product.model"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
// Validate JWT secret on startup
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}
/* Authenticate admin user */
const AuthenticateAdmin = async (email, password) => {
    try {
        // Validate environment variables
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new Error('Admin credentials not configured');
        }
        // Check if email matches
        if (email !== process.env.ADMIN_EMAIL) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        // Check if password matches
        if (password !== process.env.ADMIN_PASSWORD) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        // Generate JWT token with proper typing
        const token = jsonwebtoken_1.default.sign({
            email: email,
            role: 'admin',
            timestamp: Date.now()
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return {
            success: true,
            token: token
        };
    }
    catch (error) {
        console.error('Admin authentication error:', error);
        return {
            success: false,
            message: 'Authentication failed'
        };
    }
};
exports.AuthenticateAdmin = AuthenticateAdmin;
/* Verify JWT token */
const VerifyToken = async (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return {
            valid: true,
            payload: payload
        };
    }
    catch (error) {
        return {
            valid: false
        };
    }
};
exports.VerifyToken = VerifyToken;
// Admin Dashboard 
const getDashboardDataService = async () => {
    try {
        // Use Promise.all for parallel execution (better performance)
        const [users, categories, products] = await Promise.all([
            user_model_1.default.find(),
            category_model_1.default.find(),
            product_model_1.default.find()
        ]);
        const dashboardData = {
            totalUsers: users.length,
            totalCategories: categories.length,
            totalProducts: products.length,
        };
        return { success: true, dashboardData };
    }
    catch (error) {
        console.error("Dashboard service error:", error.message);
        return { success: false, message: "Failed to fetch dashboard data" };
    }
};
exports.getDashboardDataService = getDashboardDataService;
// When creating admin tokens
// const token = jwt.sign(
//   { 
//     adminId: admin._id.toString(), // Use adminId for clarity
//     email: admin.email,
//     role: 'admin'
//   },
//   process.env.JWT_SECRET!,
//   { expiresIn: '7d' }
// );
