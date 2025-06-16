import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

async function getProductos() {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        lineas: {
          select: {
            cantidad: true,
          },
        },
      },
      orderBy: {
        creadoEn: "desc",
      },
    })

    return productos.map((producto) => ({
      ...producto,
      totalVendido: producto.lineas.reduce((sum, linea) => sum + linea.cantidad, 0),
    }))
  } catch (error) {
    console.error("Error fetching productos:", error)
    return []
  }
}

export default async function ProductosPage() {
  const productos = await getProductos()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Productos</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Productos</CardTitle>
            <CardDescription>Gestiona todos los productos disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Vendido</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay productos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {producto.imagenUrl ? (
                            <Image
                              src={producto.imagenUrl || "/placeholder.svg"}
                              alt={producto.nombre}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                              <span className="text-xs font-medium">{producto.nombre.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          <span className="font-medium">{producto.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {producto.descripcion || "Sin descripción"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">€{producto.precio.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={producto.stock > 10 ? "default" : producto.stock > 0 ? "secondary" : "destructive"}
                        >
                          {producto.stock} unidades
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{producto.totalVendido} vendidos</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={producto.stock > 0 ? "default" : "destructive"}>
                          {producto.stock > 0 ? "Disponible" : "Agotado"}
                        </Badge>
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
