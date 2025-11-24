import { BarChart, Calendar, DollarSign, LogOut, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";

export const DashboardHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-card via-card to-card/80 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-3 shadow-lg shadow-purple-500/30">
              <DollarSign className="h-6 w-6 text-white" />
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Cobrança Fácil</h2>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Financeira</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-200"
            >
              <DollarSign className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/analytics")}
              className="gap-2 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200"
            >
              <BarChart className="h-4 w-4" />
              Relatórios
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/products")}
              className="gap-2 hover:bg-green-500/10 hover:text-green-400 transition-all duration-200"
            >
              <Package className="h-4 w-4" />
              Estoque
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
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
