import {Request, Response} from 'express' ;
import * as UserServices from './user.service';

export const SignupController = async(req: Request, res: Response): Promise<void> => {
    try {
        // Accept the exact field names frontend sends
        const { name, email, password, phone } = req.body;
        
        // Validate required fields (using frontend field names)
        if (!name || !email || !password || !phone) {
            res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
            return ;
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

       

    } catch (error: any) {
        console.error('Signup error:', error);
            res.status(500).json({
            success: false, 
            message: error.message
        });

        return;
    }
};


export const LoginController = async(req: Request, res: Response): Promise<void> => {
   try {
        const { email, password} = req.body ;
        const {user, token} = await UserServices.LoginService({
            email,
            password
        });

        res.status(201).json({success: true, message: 'Login Successfully', user: user, token})


    
   } catch (error: any) {
       res.status(500).json({success: false, message: error.message})
   }
};


export const logoutController = async (req: Request, res: Response): Promise<void> => {
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
        
    } catch (error: any) {
        console.error('Logout error:', error);
        
        if (error.message === 'Token has expired') {
            res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        } else if (error.message === 'Invalid token') {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};





// Frontend sends: { name, email, password, phone }

// Backend handles:

// Maps name → fullName in database

// Maps phone → mobile in database

// Removes confirmPassword validation (since frontend doesn't send it)

// Updates error messages to match frontend expectations