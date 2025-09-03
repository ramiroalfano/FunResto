"use client"

import {
  Calendar,
  User,
  GraduationCap,
  Clock,
  CheckCircle,
  ShoppingBag,
  CreditCard,
  Banknote,
  Search,
  Check,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { updateOrder, Order } from "../lib/ordersService"

interface AdminOrdersProps {
  orders: (Order & { id: string })[]
}

export function AdminOrders({ orders }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const handleApprove = async (orderId: string) => {
    try {
      await updateOrder(orderId, { status: "completed" })
      alert("Pedido aprobado con éxito.")
    } catch (error) {
      console.error("Error al aprobar el pedido:", error)
      alert("Ocurrió un error al aprobar el pedido.")
    }
  }

  const handleReject = async (orderId: string) => {
    try {
      await updateOrder(orderId, { status: "rejected" })
      alert("Pedido rechazado con éxito.")
    } catch (error) {
      console.error("Error al rechazar el pedido:", error)
      alert("Ocurrió un error al rechazar el pedido.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
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
      case "rejected":
        return "Rechazado"
      default:
        return status
    }
  }

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "pagado":
        return "bg-green-100 text-green-800"
      case "pendiente":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.childName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.course?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.parentName?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Panel de Administración - Pedidos</h2>
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No hay pedidos registrados</p>
          <p className="text-sm text-muted-foreground mt-2">Los pedidos de los usuarios aparecerán aquí</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Panel de Administración - Pedidos</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por alumno, curso o padre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
            <SelectItem value="delivered">Entregado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pagos</SelectItem>
            <SelectItem value="mercadopago">Mercado Pago</SelectItem>
            <SelectItem value="efectivo">Efectivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Total Pedidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.paymentStatus === "pagado").length}
            </div>
            <div className="text-sm text-muted-foreground">Pagados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {orders.filter((o) => o.paymentStatus === "pendiente").length}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Ventas</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.status || "")}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {getStatusText(order.status || "")}
                  </Badge>
                  <Badge className={getPaymentStatusColor(order.paymentStatus || "")}>
                    {order.paymentMethod === "mercadopago" ? (
                      <CreditCard className="w-3 h-3 mr-1" />
                    ) : (
                      <Banknote className="w-3 h-3 mr-1" />
                    )}
                    {order.paymentStatus === "pagado" ? "Pagado" : "Pendiente"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(order.createdAt || "").toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">${(order.total || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  {order.paymentMethod === "mercadopago" ? "Mercado Pago" : "Efectivo"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Estudiante</h4>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">{order.childName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>{order.course}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Responsable</h4>
                  <div className="text-sm space-y-1">
                    <div className="font-medium">{order.parentName}</div>
                    <div className="text-muted-foreground">{order.parentEmail}</div>
                    <div className="text-muted-foreground">{order.parentPhone}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Días de Comida
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{(order.items || []).length} días</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(order.items || []).map((item: any) => (
                      <Badge key={item.day} variant="outline" className="text-xs">
                        {new Date(item.day).toLocaleDateString("es-ES", { weekday: 'short', day: 'numeric', month: 'short' })}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {order.receiptUrl && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Comprobante de Pago
                  </h4>
                  <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                    <img src={order.receiptUrl} alt="Comprobante" className="max-w-xs rounded-lg" />
                  </a>
                </div>
              )}

              {order.status === "pending" && (
                <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(order.id)}>
                    <Check className="w-4 h-4 mr-1" /> Aprobar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(order.id)}>
                    <X className="w-4 h-4 mr-1" /> Rechazar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
