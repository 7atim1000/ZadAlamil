import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../users/user.model';
import Category from '../categories/category.model';
import Product from '../products/product.model';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Validate JWT secret on startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/* Authenticate admin user */
export const AuthenticateAdmin = async (email: string, password: string): Promise<{ 
  success: boolean; 
  token?: string; 
  message?: string 
}> => {
    
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
    const token = jwt.sign(
      { 
        email: email,
        role: 'admin',
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
      success: true,
      token: token
    };

  } catch (error) {
    console.error('Admin authentication error:', error);
    return {
      success: false,
      message: 'Authentication failed'
    };
  }
};

/* Verify JWT token */
export const VerifyToken = async (token: string): Promise<{ 
  valid: boolean; 
  payload?: any 
}> => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      payload: payload
    };
  } catch (error) {
    return {
      valid: false
    };
  }
};


export interface AddVendorResponse {
  success: boolean;
  message: string;
  vendorId?: string;
  data?: any;
}


// Admin Dashboard 
export const getDashboardDataService = async () => {
    try {
        // Use Promise.all for parallel execution (better performance)
        const [users, categories, products] = await Promise.all([
            User.find(),
            Category.find(),
            Product.find()
        ]);

        const dashboardData = {
            totalUsers: users.length,
            totalCategories: categories.length,
            totalProducts: products.length,
        };

        return { success: true, dashboardData };

    } catch (error: any) {
        console.error("Dashboard service error:", error.message);
        return { success: false, message: "Failed to fetch dashboard data" };
    }
};



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