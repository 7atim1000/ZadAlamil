"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = exports.LoginService = exports.SignupService = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Add this import
const SignupService = async (userData) => {
    const { name, email, password, phone } = userData; // Frontend fields
    // Since frontend doesn't send confirmPassword, remove that validation
    // Or if you need password confirmation, the frontend should handle it
    // Optional: Add password strength validation
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    // Check if user already exists
    const existingUser = await user_model_1.default.findOne({
        $or: [
            { email: email },
            { mobile: phone }
        ]
    });
    if (existingUser) {
        if (existingUser.email === email) {
            throw new Error('Email is already used.');
        }
        if (existingUser.mobile === phone) {
            throw new Error('Mobile number is already used.');
        }
    }
    // Hash password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    // Create new user - map frontend fields to database fields
    const newUser = await user_model_1.default.create({
        fullName: name, // Map 'name' to 'fullName'
        email: email,
        password: hashedPassword,
        mobile: phone // Map 'phone' to 'mobile'
    });
    // Generate token
    // const token = generateToken(newUser._id.toString());
    const token = jsonwebtoken_1.default.sign({
        userId: newUser._id.toString(), // Add this
        email: newUser.email,
        //role: newUser.role // Include role if needed
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { user: newUser.toObject(), token };
};
exports.SignupService = SignupService;
const LoginService = async (loginData) => {
    const { email, password } = loginData;
    // find user by email 
    const userData = await user_model_1.default.findOne({ email });
    if (!userData) {
        throw new Error('Sorry user is not found');
    }
    // check password 
    const isPasswordCorrect = await bcryptjs_1.default.compare(password, userData.password);
    if (!isPasswordCorrect) {
        throw new Error('Invalid Credentials');
    }
    // const token = generateToken(userData._id);
    const token = jsonwebtoken_1.default.sign({
        userId: userData._id.toString(), // Add this
        email: userData.email,
        //role: newUser.role // Include role if needed
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { user: userData.toObject(), token };
};
exports.LoginService = LoginService;
const logoutService = async (token) => {
    try {
        // If you're using a token blacklist, you can add the token here
        // For example, if you have a Blacklist model:
        // await Blacklist.create({ token, expiredAt: new Date() });
        // Or if you're using Redis for token management:
        // await redisClient.setex(`blacklist:${token}`, 3600, 'true'); // Blacklist for 1 hour
        // For now, we'll just verify the token and return success
        // The actual token invalidation happens on frontend by removing it from localStorage
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return {
            success: true,
            message: 'Logout successful'
        };
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        else {
            throw new Error('Logout failed');
        }
    }
};
exports.logoutService = logoutService;
