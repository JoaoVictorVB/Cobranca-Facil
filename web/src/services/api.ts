import { toast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
  timeout: 10000, // 10 segundos
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Pode adicionar tokens aqui no futuro
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

