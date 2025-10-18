import { TopClient } from "../../services/reports.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface TopClientsTableProps {
  clients: TopClient[];
}

export function TopClientsTable({ clients }: TopClientsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Melhores Clientes</CardTitle>
        <CardDescription>Top 5 clientes por valor de compras</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Total Compras</TableHead>
              <TableHead className="text-right">Pago</TableHead>
              <TableHead className="text-right">Pendente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.clientId}>
                <TableCell className="font-medium">{client.clientName}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.totalPurchases)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.totalPaid)}
                </TableCell>
                <TableCell className="text-right text-yellow-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.totalPending)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
