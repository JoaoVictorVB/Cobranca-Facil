import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, DollarSign, Info, TrendingUp, Users } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalSold: number;
    totalPaid: number;
    totalPending: number;
    totalClients: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Vendido
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">
                    <strong>Valor total de todas as suas vendas.</strong><br/>
                    Inclui parcelas pagas, pendentes e vencidas de todos os seus clientes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(stats.totalSold)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Recebido
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">
                    <strong>Valor total já recebido</strong> de todas as parcelas pagas.<br/>
                    Este é o dinheiro que realmente entrou no seu caixa.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {formatCurrency(stats.totalPaid)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                A Receber
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">
                    <strong>Valor total ainda pendente</strong> de pagamento.<br/>
                    Inclui parcelas a vencer e parcelas vencidas (atrasadas).
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(stats.totalPending)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">
                    <strong>Total de clientes cadastrados</strong> no sistema.<br/>
                    Cada cliente pode ter uma ou mais vendas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalClients}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
