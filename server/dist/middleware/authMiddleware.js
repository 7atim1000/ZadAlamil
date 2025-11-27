"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorAuthMiddleware = exports.requireAdmin = exports.authMiddleware = exports.protectUserRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../modules/users/user.model")); // Your user model
;
// 1- For Users
const protectUserRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Access token required' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Look for userId in token (users should have userId)
        const userId = decoded.userId || decoded.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Invalid user token' });
            return;
        }
        const user = await user_model_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        // Error handling...
    }
};
exports.protectUserRoute = protectUserRoute;
const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};
exports.authMiddleware = authMiddleware;
// Optional: Admin role middleware
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
            return;
        }
        // Check if user has admin role (adjust based on your user model)
        if (req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.requireAdmin = requireAdmin;
// For Vendor
const vendorAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
        }
        // Check if JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach vendor info to request
        req.vendor = {
            vendorId: decoded.vendorId,
            email: decoded.email,
            role: decoded.role
        };
        console.log("🔍 Vendor authenticated:", req.vendor);
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
exports.vendorAuthMiddleware = vendorAuthMiddleware;
// export const vendorAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "Access denied. No token provided." 
//       });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
//     // Check if the token is for a vendor
//     if (decoded.role !== 'vendor') {
//       return res.status(403).json({ 
//         success: false, 
//         message: "Access denied. Vendor privileges required." 
//       });
//     }
//     (req as any).vendor = decoded;
//     next();
//   } catch (error) {
//     console.error("Vendor auth middleware error:", error);
//     return res.status(401).json({ 
//       success: false, 
//       message: "Invalid token" 
//     });
//   }
// };
