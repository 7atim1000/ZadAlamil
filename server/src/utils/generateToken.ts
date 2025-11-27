// In your generateToken.ts file
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (userId: string | Types.ObjectId): string => {
    const id = typeof userId === 'string' ? userId : userId.toString();
    
    return jwt.sign(
        { userId: id },
        process.env.JWT_SECRET!,
        { expiresIn: '30d' }
    );
};

// import jwt from 'jsonwebtoken' ;

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key' ;

// export const generateToken = (userId: string): string => {
//     // return jwt.sign({ userId }, JWT_SECRET, { expiredIn: '7d' });
//      const token = jwt.sign({userId}, JWT_SECRET);
//     return token;
// };