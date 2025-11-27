import { generateToken } from '../../utils/generateToken'; 
import  User  from './user.model';
import { IUser, SignupRequest, LoginRequest } from './user.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Add this import



export const SignupService = async(userData: SignupRequest): Promise<{user: IUser, token: string}> => {
    
    const { name, email, password, phone } = userData; // Frontend fields

    // Since frontend doesn't send confirmPassword, remove that validation
    // Or if you need password confirmation, the frontend should handle it

    // Optional: Add password strength validation
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user - map frontend fields to database fields
    const newUser = await User.create({
        fullName: name,    // Map 'name' to 'fullName'
        email: email,
        password: hashedPassword,
        mobile: phone      // Map 'phone' to 'mobile'
    });
    
    // Generate token
    // const token = generateToken(newUser._id.toString());
    const token = jwt.sign(
        {
            userId: newUser._id.toString(), // Add this
            email: newUser.email,
            //role: newUser.role // Include role if needed
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );
    return { user: newUser.toObject(), token };
};



export const LoginService = async(loginData: LoginRequest): Promise<{user: IUser, token: string}> => {
    const {email, password} = loginData;

    // find user by email 
    const userData = await User.findOne({email}) 
    if (!userData) {
        throw new Error('Sorry user is not found')
    }

    // check password 
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
        throw new Error('Invalid Credentials')
    }

    // const token = generateToken(userData._id);
    const token = jwt.sign(
        {
            userId: userData._id.toString(), // Add this
            email: userData.email,
            //role: newUser.role // Include role if needed
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );
    return { user: userData.toObject(), token }

};

export const logoutService = async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
        // If you're using a token blacklist, you can add the token here
        // For example, if you have a Blacklist model:
        // await Blacklist.create({ token, expiredAt: new Date() });
        
        // Or if you're using Redis for token management:
        // await redisClient.setex(`blacklist:${token}`, 3600, 'true'); // Blacklist for 1 hour

        // For now, we'll just verify the token and return success
        // The actual token invalidation happens on frontend by removing it from localStorage
        jwt.verify(token, process.env.JWT_SECRET!);
        
        return { 
            success: true, 
            message: 'Logout successful' 
        };
        
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Logout failed');
        }
    }
};



