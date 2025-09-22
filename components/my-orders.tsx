'use client'

import { Calendar, User, GraduationCap, Clock, CheckCircle, ShoppingBag, Truck, XCircle, PackageCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/lib/ordersService"

interface MyOrdersProps {
  orders: Order[]
}

export function MyOrders({ orders }: MyOrdersProps) {

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case "completed":
        return { text: "Completado", color: "bg-green-100 text-green-800", Icon: PackageCheck }
      case "pending":
        return { text: "Pendiente", color: "bg-yellow-100 text-yellow-800", Icon: Clock }
      case "delivered":
        return { text: "Entregado", color: "bg-blue-100 text-blue-800", Icon: Truck }
      case "approved":
        return { text: "Aprobado", color: "bg-green-100 text-green-800", Icon: CheckCircle }
      case "rejected":
        return { text: "Rechazado", color: "bg-red-100 text-red-800", Icon: XCircle }
      case "not_delivered":
        return { text: "No Entregado", color: "bg-red-100 text-red-800", Icon: XCircle }
      default:
        return { text: status, color: "bg-gray-100 text-gray-800", Icon: ShoppingBag }
    }
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Mis Pedidos</h2>
        <div className="text-center py-12 bg-card border rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No tienes pedidos aún</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Tus pedidos aparecerán aquí una vez que completes una compra.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Mis Pedidos</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const { text: statusText, color: statusColor, Icon: StatusIcon } = getStatusInfo(order.status)
          return (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="p-4 bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(order.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="font-bold text-foreground">${order.total.toLocaleString()}</div>
                    </div>
                  </div>
                  <Badge className={`${statusColor} flex-shrink-0 self-start sm:self-auto`}>
                    <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                    <span className="text-xs font-medium">{statusText}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-medium text-muted-foreground">Estudiante:</span>
                                <span className="font-bold text-foreground">{order.childName}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-medium text-muted-foreground">Curso:</span>
                                <span className="font-bold text-foreground">{order.course}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-medium text-muted-foreground">Días seleccionados:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                        {order.selectedDays.map((day) => (
                            <Badge key={day} variant="outline" className="font-mono text-xs">
                            {new Date(day).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            </Badge>
                        ))}
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
