import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

async function getClientes() {
  try {
    await prisma.$connect()

    const clientes = await prisma.cliente.findMany({
      include: {
        pedidos: {
          select: {
            id: true,
            total: true,
          },
        },
      },
      orderBy: {
        creadoEn: "desc",
      },
    })

    return clientes.map((cliente) => ({
      ...cliente,
      totalPedidos: cliente.pedidos.length,
      totalGastado: cliente.pedidos.reduce((sum, pedido) => sum + (pedido.total || 0), 0),
    }))
  } catch (error) {
    console.error("Error fetching clientes:", error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Clientes</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              Gestiona todos los clientes registrados en el sistema ({clientes.length} clientes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gastado</TableHead>
                  <TableHead>Registrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No hay clientes registrados en la base de datos
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {cliente.nombre} {cliente.apellidos}
                          </span>
                          <span className="text-sm text-muted-foreground">DNI: {cliente.dni}</span>
                        </div>
                      </TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.telefono}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{cliente.totalPedidos} pedidos</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">€{cliente.totalGastado.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(cliente.creadoEn), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
