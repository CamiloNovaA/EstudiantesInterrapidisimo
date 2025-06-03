export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    idUser: number;
    email: string;
} 