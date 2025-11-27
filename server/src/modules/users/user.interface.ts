export interface IUser {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
    mobile: string; 
    profilePic: string;
    createdAt: Date ;
    updatedAt: Date;
};

export interface SignupRequest {
    name: string;        // Frontend sends 'name' (maps to fullName)
    email: string;
    password: string;
    phone: string;       // Frontend sends 'phone' (maps to mobile)
    // confirmPassword is not sent by frontend, so we'll handle validation differently
};

export interface LoginRequest{
    email: string;
    password: string;
};

export interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
};

