import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Users, ShoppingCart, Package, FileText } from "lucide-react"

async function getDashboardStats() {
  try {
    // Test the connection first
    await prisma.$connect()

    const [clientesCount, pedidosCount, productosCount, facturasCount] = await Promise.all([
      prisma.cliente.count(),
      prisma.pedido.count(),
      prisma.producto.count(),
      prisma.factura.count(),
    ])

    return {
      clientes: clientesCount,
      pedidos: pedidosCount,
      productos: productosCount,
      facturas: facturasCount,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return default values if there's an error
    return {
      clientes: 0,
      pedidos: 0,
      productos: 0,
      facturas: 0,
      error: true,
    }
  } finally {
    await prisma.$disconnect()
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {stats.error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error de Conexión</CardTitle>
              <CardDescription>
                No se pudo conectar a la base de datos. Verifica la configuración de DATABASE_URL.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientes}</div>
              <p className="text-xs text-muted-foreground">Clientes registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pedidos}</div>
              <p className="text-xs text-muted-foreground">Pedidos realizados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.productos}</div>
              <p className="text-xs text-muted-foreground">Productos en catálogo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.facturas}</div>
              <p className="text-xs text-muted-foreground">Facturas emitidas</p>
            </CardContent>
          </Card>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Bienvenido al Dashboard de Oleum</CardTitle>
              <CardDescription>Gestiona tus clientes, pedidos, productos y facturas desde aquí.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Utiliza el menú lateral para navegar entre las diferentes secciones del sistema.
              </p>
              {!stats.error && (
                <div className="mt-4 text-sm text-green-600">
                  ✅ Conexión a la base de datos establecida correctamente
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
