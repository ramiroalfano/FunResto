'use client'

import { Calendar, User, GraduationCap, Clock, CheckCircle, ShoppingBag, Truck, XCircle, PackageCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/lib/ordersService" // Importar la interfaz principal

interface MyOrdersProps {
  orders: Order[]
}

export function MyOrders({ orders }: MyOrdersProps) {

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case "completed":
        return { text: "Completado", color: "bg-green-100 text-green-800", Icon: PackageCheck }
      case "pending":
        return { text: "Pendiente de Aprobación", color: "bg-yellow-100 text-yellow-800", Icon: Clock }
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
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Mis Pedidos</h2>
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No tienes pedidos aún</p>
          <p className="text-sm text-muted-foreground mt-2">
            Tus pedidos aparecerán aquí una vez que completes una compra
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Mis Pedidos</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const { text: statusText, color: statusColor, Icon: StatusIcon } = getStatusInfo(order.status)
          return (
            <Card key={order.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${statusColor} flex items-center`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusText}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium">Estudiante:</span>
                      <span>{order.childName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="font-medium">Curso:</span>
                      <span>{order.course}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">Días seleccionados:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {order.selectedDays.map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day}
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
