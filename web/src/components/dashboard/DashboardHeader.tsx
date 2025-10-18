import { Calendar, DollarSign, LogOut } from "lucide-react";
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
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Sistema de Cobranças</h2>
              <p className="text-sm text-muted-foreground">Relógios & Pratas</p>
            </div>
          </div>
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
    </header>
  );
};
