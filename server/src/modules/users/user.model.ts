import mongoose from 'mongoose' ;
import { IUser } from './user.interface';

const userSchema = new mongoose.Schema({
    
    fullName: { type: String, required: true },  // Store as fullName
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },     // Store as mobile
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
    
}, {
    timestamps: true
});


export const User = mongoose.model<IUser>('User', userSchema);
export default User ;