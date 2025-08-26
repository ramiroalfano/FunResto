"use client"

import { Calendar, User, GraduationCap, Clock, CheckCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  childName: string
  course: string
  selectedDays: string[]
  totalAmount: number
  date: string
  status: "completed" | "pending" | "delivered"
}

interface MyOrdersProps {
  orders: Order[]
}

export function MyOrders({ orders }: MyOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "delivered":
        return "Entregado"
      default:
        return status
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
        {orders.map((order) => (
          <Card key={order.id} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {getStatusText(order.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {order.date}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">${order.totalAmount}</span>
                </div>
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
        ))}
      </div>
    </div>
  )
}
