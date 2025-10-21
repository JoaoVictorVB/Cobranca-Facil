import { toast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === 'production';

if (!IS_PRODUCTION) {
  console.log('🔧 API Configuration:', {
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    environment: import.meta.env.VITE_APP_ENV || 'development',
  });
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string,
    public path: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      toast({
        title: '❌ Erro de Conexão',
        description: 'Não foi possível conectar ao servidor. Verifique se a API está rodando.',
        variant: 'destructive',
      });
      return Promise.reject(new ApiError(
        'Erro de conexão com o servidor',
        0,
        'NetworkError',
        ''
      ));
    }

    const errorResponse = error.response.data;
    
    const apiError = new ApiError(
      errorResponse.message || 'Erro desconhecido',
      errorResponse.statusCode || error.response.status,
      errorResponse.error || 'UnknownError',
      errorResponse.path || error.config?.url || '',
    );

    switch (errorResponse.statusCode) {
      case 400:
        toast({
          title: '⚠️ Dados Inválidos',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 401: {
        const isAuthRoute = errorResponse.path?.includes('/auth/');
        
        if (!isAuthRoute) {
          toast({
            title: '🔒 Não Autorizado',
            description: 'Sua sessão expirou. Faça login novamente.',
            variant: 'destructive',
          });
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('isAuthenticated');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
        break;
      }

      case 404:
        toast({
          title: '🔍 Não Encontrado',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 409:
        toast({
          title: '⚠️ Conflito',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 422:
        toast({
          title: '⚠️ Erro de Validação',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 500:
        toast({
          title: '❌ Erro no Servidor',
          description: 'Ocorreu um erro interno. Tente novamente mais tarde.',
          variant: 'destructive',
        });
        break;

      default:
        toast({
          title: '❌ Erro',
          description: errorResponse.message || 'Ocorreu um erro inesperado',
          variant: 'destructive',
        });
    }

    return Promise.reject(apiError);
  }
);

