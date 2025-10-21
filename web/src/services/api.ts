import { toast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';

// Configurações da API a partir das variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === 'production';

// Log da configuração em desenvolvimento
if (!IS_PRODUCTION) {
  console.log('🔧 API Configuration:', {
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    environment: import.meta.env.VITE_APP_ENV || 'development',
  });
}

// Interface para o formato de erro da API
export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

// Tipos de erros customizados
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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
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

// Response interceptor com tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    // Erro de rede ou timeout
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
    
    // Criar erro customizado
    const apiError = new ApiError(
      errorResponse.message || 'Erro desconhecido',
      errorResponse.statusCode || error.response.status,
      errorResponse.error || 'UnknownError',
      errorResponse.path || error.config?.url || '',
    );

    // Tratar erros específicos
    switch (errorResponse.statusCode) {
      case 400:
        // Bad Request - Validação
        toast({
          title: '⚠️ Dados Inválidos',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 401: {
        // Unauthorized - Não autenticado ou token inválido
        // Não mostrar toast e não limpar dados se o erro for em rotas de auth
        const isAuthRoute = errorResponse.path?.includes('/auth/');
        
        if (!isAuthRoute) {
          toast({
            title: '🔒 Não Autorizado',
            description: 'Sua sessão expirou. Faça login novamente.',
            variant: 'destructive',
          });
          // Limpar dados de autenticação
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('isAuthenticated');
          // Redirecionar para login apenas se não estiver em páginas públicas
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
        break;
      }

      case 404:
        // Not Found
        toast({
          title: '🔍 Não Encontrado',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 409:
        // Conflict
        toast({
          title: '⚠️ Conflito',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 422:
        // Unprocessable Entity
        toast({
          title: '⚠️ Erro de Validação',
          description: errorResponse.message,
          variant: 'destructive',
        });
        break;

      case 500:
        // Internal Server Error
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

