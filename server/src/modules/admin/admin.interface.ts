export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface TokenPayload {
  email: string;
  role: string;
  timestamp: number;
  iat?: number;
  exp?: number;
}