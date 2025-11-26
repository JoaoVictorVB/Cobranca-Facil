import { BarChart, Building2, Calendar, LogOut, Moon, Network, Package, Settings, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";

export const DashboardHeader = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-primary p-2.5">
              <Building2 className="h-5 w-5 text-primary-foreground" />
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Cobrança Fácil</h2>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Financeira</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/analytics")}
              className="gap-2"
            >
              <BarChart className="h-4 w-4" />
              Relatórios
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/products")}
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              Estoque
            </Button>
            {/* TEMPORARIAMENTE DESABILITADO */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/distribution")}
              className="gap-2 transition-colors hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
            >
              <Network className="h-4 w-4" />
              Distribuição
            </Button> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
