export interface User {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    role: string[];
}

export interface AuthResponse {
    status: string;
    data: {
        id: string;
        email: string;
        token: string;
        name: string;
        isActive: boolean;
        role: string[];
    };
}

export interface LoginResponse {
    user: User;
    token: string;
}

export enum AuthStatus {
    checking = 'checking',
    authenticated = 'authenticated',
    notAuthenticated = 'notAuthenticated',
}
