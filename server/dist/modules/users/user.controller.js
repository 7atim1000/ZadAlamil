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
exports.logoutController = exports.LoginController = exports.SignupController = void 0;
const UserServices = __importStar(require("./user.service"));
const SignupController = async (req, res) => {
    try {
        // Accept the exact field names frontend sends
        const { name, email, password, phone } = req.body;
        // Validate required fields (using frontend field names)
        if (!name || !email || !password || !phone) {
            res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
            return;
        }
        const { user, token } = await UserServices.SignupService({
            name,
            email,
            password,
            phone
        });
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: user,
            token
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
        return;
    }
};
exports.SignupController = SignupController;
const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await UserServices.LoginService({
            email,
            password
        });
        res.status(201).json({ success: true, message: 'Login Successfully', user: user, token });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.LoginController = LoginController;
const logoutController = async (req, res) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
            return;
        }
        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        const result = await UserServices.logoutService(token);
        res.status(200).json({
            success: result.success,
            message: result.message
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        if (error.message === 'Token has expired') {
            res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }
        else if (error.message === 'Invalid token') {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};
exports.logoutController = logoutController;
// Frontend sends: { name, email, password, phone }
// Backend handles:
// Maps name → fullName in database
// Maps phone → mobile in database
// Removes confirmPassword validation (since frontend doesn't send it)
// Updates error messages to match frontend expectations
