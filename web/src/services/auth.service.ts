import { api } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name?: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.user = null;
      }
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (!response.data.access_token) {
        throw new Error('Token não retornado pela API');
      }
      
      this.token = response.data.access_token;
      this.user = response.data.user;
      
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('auth_user', JSON.stringify(this.user));
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Se for erro 401, mostrar mensagem específica
      if (error.response?.status === 401) {
        throw new Error('Email ou senha incorretos');
      }
      
      // Se houver mensagem do backend, usar ela
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Mensagem genérica
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      
      if (!response.data.access_token) {
        throw new Error('Token não retornado pela API');
      }
      
      this.token = response.data.access_token;
      this.user = response.data.user;
      
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('auth_user', JSON.stringify(this.user));
      
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Se houver mensagem do backend, usar ela
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Mensagem genérica
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('isAuthenticated');
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }
}

export const authService = new AuthService();
