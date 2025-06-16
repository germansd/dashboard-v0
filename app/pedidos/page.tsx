import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

async function getPedidos() {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: {
          select: {
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
        lineas: {
          include: {
            producto: {
              select: {
                nombre: true,
              },
            },
          },
        },
        factura: {
          select: {
            numero: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    })

    return pedidos
  } catch (error) {
    console.error("Error fetching pedidos:", error)
    return []
  }
}

export default async function PedidosPage() {
  const pedidos = await getPedidos()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Pedidos</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>Todos los pedidos realizados por los clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay pedidos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidos.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium">#{pedido.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {pedido.cliente.nombre} {pedido.cliente.apellidos}
                          </span>
                          <span className="text-sm text-muted-foreground">{pedido.cliente.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {pedido.lineas.slice(0, 2).map((linea, index) => (
                            <span key={index} className="text-sm">
                              {linea.cantidad}x {linea.producto.nombre}
                            </span>
                          ))}
                          {pedido.lineas.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{pedido.lineas.length - 2} más</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {pedido.total ? `€${pedido.total.toFixed(2)}` : "Sin calcular"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={pedido.factura ? "default" : "secondary"}>
                          {pedido.factura ? "Facturado" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(pedido.fecha), {
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
