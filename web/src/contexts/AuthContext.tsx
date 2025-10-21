import { useToast } from '@/hooks/use-toast';
import { authService, LoginRequest, RegisterRequest, User } from '@/services/auth.service';
import { createContext, ReactNode, useState } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  });
  const [user, setUser] = useState<User | null>(() => {
    return authService.getUser();
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setIsAuthenticated(true);
      setUser(response.user);
      toast({
        title: "✅ Login realizado",
        description: "Bem-vindo de volta!",
      });
      return true;
    } catch (error) {
      toast({
        title: "❌ Erro no login",
        description: error instanceof Error ? error.message : "Erro ao fazer login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      setIsAuthenticated(true);
      setUser(response.user);
      toast({
        title: "✅ Conta criada",
        description: "Cadastro realizado com sucesso!",
      });
      return true;
    } catch (error) {
      toast({
        title: "❌ Erro no cadastro",
        description: error instanceof Error ? error.message : "Erro ao criar conta",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
