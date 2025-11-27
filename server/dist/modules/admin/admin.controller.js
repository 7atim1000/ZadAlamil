"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardDataController = exports.VerifyTokenController = exports.AdminLoginController = void 0;
const AdminService = __importStar(require("./admin.service"));
/* Handle admin login */
const AdminLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }
        // Authenticate admin
        const authResult = await AdminService.AuthenticateAdmin(email, password);
        if (authResult.success && authResult.token) {
            res.status(200).json({
                success: true,
                token: authResult.token,
                message: 'Login successful'
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: authResult.message || 'Authentication failed'
            });
        }
    }
    catch (error) {
        console.error('Admin login controller error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.AdminLoginController = AdminLoginController;
/* Verify token endpoint (optional) */
const VerifyTokenController = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                valid: false,
                message: 'No token provided'
            });
            return;
        }
        const verificationResult = await AdminService.VerifyToken(token);
        if (verificationResult.valid) {
            res.status(200).json({
                valid: true,
                payload: verificationResult.payload
            });
        }
        else {
            res.status(401).json({
                valid: false,
                message: 'Invalid token'
            });
        }
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            valid: false,
            message: 'Token verification failed'
        });
    }
};
exports.VerifyTokenController = VerifyTokenController;
const getDashboardDataController = async (req, res) => {
    try {
        const result = await AdminService.getDashboardDataService();
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.getDashboardDataController = getDashboardDataController;
