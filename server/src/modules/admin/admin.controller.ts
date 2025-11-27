import { Request, Response } from 'express';
import * as AdminService from './admin.service';


/* Handle admin login */
export const AdminLoginController = async (req: Request, res: Response): Promise<void> => {
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
    } else {
      res.status(401).json({
        success: false,
        message: authResult.message || 'Authentication failed'
      });
    }

  } catch (error) {
    console.error('Admin login controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/* Verify token endpoint (optional) */
export const VerifyTokenController = async (req: Request, res: Response): Promise<void> => {
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
    } else {
      res.status(401).json({
        valid: false,
        message: 'Invalid token'
      });
    }

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      valid: false,
      message: 'Token verification failed'
    });
  }

};


export const getDashboardDataController = async(req: Request, res: Response) => {
    
  try {
        const result = await AdminService.getDashboardDataService();
        res.status(200).json(result);

    } catch (error) {
        console.log((error as Error).message);
        res.json({ success: false, message: (error as Error).message})
    }
};


