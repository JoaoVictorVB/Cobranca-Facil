import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

interface PeriodSummaryCardsProps {
  totalExpected: number;
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  receivedPercentage: number;
  installmentsCount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export const PeriodSummaryCards = ({
  totalExpected,
  totalReceived,
  totalPending,
  totalOverdue,
  receivedPercentage,
  installmentsCount,
  paidCount,
  pendingCount,
  overdueCount,
}: PeriodSummaryCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Esperado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalExpected)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {installmentsCount} parcelas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Recebido
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalReceived)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidCount} pagas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pendente
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingCount} pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Atrasado
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOverdue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overdueCount} atrasadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aproveitamento do Período</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Recebimento</span>
              <span className="text-2xl font-bold text-green-600">
                {receivedPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={receivedPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Recebido</p>
              <p className="text-lg font-bold text-green-600">
                {((paidCount / installmentsCount) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Pendente</p>
              <p className="text-lg font-bold text-yellow-600">
                {((pendingCount / installmentsCount) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Atrasado</p>
              <p className="text-lg font-bold text-red-600">
                {((overdueCount / installmentsCount) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
