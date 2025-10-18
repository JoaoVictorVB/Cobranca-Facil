import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface RevenueChartProps {
  data: {
    month: string;
    expected: number;
    received: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartConfig = {
    expected: {
      label: "Esperado",
      color: "hsl(var(--chart-1))",
    },
    received: {
      label: "Recebido",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Esperada vs Recebida</CardTitle>
        <CardDescription>Comparação mensal de valores</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="expected" fill="var(--color-expected)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="received" fill="var(--color-received)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
