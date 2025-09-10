'use client'

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
  X,
  Trash2,
  Truck,
  PackageCheck,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Order } from "@/lib/ordersService"

interface AdminOrdersProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void
  onDeleteOrder: (orderId: string) => void
}

export function AdminOrders({ orders, onUpdateOrderStatus, onDeleteOrder }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedTransferImage, setSelectedTransferImage] = useState<string | null>(null)
  const [showTransferModal, setShowTransferModal] = useState(false)

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
      order.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.parentName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const handleViewTransferImage = (imageUrl: string) => {
    setSelectedTransferImage(imageUrl)
    setShowTransferModal(true)
  }

  const handleCloseTransferModal = () => {
    setShowTransferModal(false)
    setSelectedTransferImage(null)
  }

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
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="rejected">Rechazado</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="not_delivered">No Entregado</SelectItem>
            </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pagos</SelectItem>
            <SelectItem value="mercadopago">Mercado Pago</SelectItem>
            <SelectItem value="cash">Efectivo</SelectItem>
            <SelectItem value="transfer">Transferencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
                <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.paymentStatus === "pendiente").length}
                </div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "approved").length}
                </div>
                <div className="text-sm text-muted-foreground">Aprobados</div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                    ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Ventas</div>
            </CardContent>
            </Card>
        </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
            const { text: statusText, color: statusColor, Icon: StatusIcon } = getStatusInfo(order.status)
            return (
            <Card key={order.id} className="border-border">
                <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(order.date).toLocaleString()}</div>
                            <div className="flex items-center gap-1 font-medium">${(order.total || 0).toLocaleString()}</div>
                            <div>{order.paymentMethod === "mercadopago" ? "Mercado Pago" : order.paymentMethod === "transfer" ? "Transferencia" : "Efectivo"}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                            <Badge className={`${statusColor} flex items-center`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusText}
                            </Badge>
                            <Badge className={`${getPaymentStatusColor(order.paymentStatus)} flex items-center`}>
                                {order.paymentMethod === "mercadopago" ? <CreditCard className="w-3 h-3 mr-1" /> : <Banknote className="w-3 h-3 mr-1" />}
                                {order.paymentStatus === "pagado" ? "Pagado" : "Pendiente"}
                            </Badge>
                        </div>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Estudiante</h4>
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> <span className="font-medium">{order.childName}</span></div>
                        <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /> <span>{order.course}</span></div>
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
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Días de Comida</h4>
                        <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-primary" /> <span className="text-sm font-medium">{order.selectedDays.length} días</span></div>
                        <div className="flex flex-wrap gap-1">
                            {order.selectedDays.map((day) => (<Badge key={day} variant="outline" className="text-xs">{day}</Badge>))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {order.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onUpdateOrderStatus(order.id, "approved")}><CheckCircle className="w-3 h-3 mr-1" /> Aprobar</Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => onUpdateOrderStatus(order.id, "rejected")}><X className="w-3 h-3 mr-1" /> Rechazar</Button>
                    </>
                  )}
                  
                  {order.status === 'approved' && (
                    <>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onUpdateOrderStatus(order.id, "delivered")}><Truck className="w-3 h-3 mr-1" /> Entregado</Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onUpdateOrderStatus(order.id, "completed")}><PackageCheck className="w-3 h-3 mr-1" /> Completado</Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => onUpdateOrderStatus(order.id, "not_delivered")}><XCircle className="w-3 h-3 mr-1" /> No Entregado</Button>
                    </>
                  )}

                  {(order.status === 'completed' || order.status === 'rejected') && (
                    <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => onDeleteOrder(order.id)}><Trash2 className="w-3 h-3 mr-1" /> Eliminar</Button>
                  )}

                  {order.paymentMethod === 'transfer' && order.transferImage && (
                    <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => handleViewTransferImage(order.transferImage!)}><Banknote className="w-3 h-3 mr-1" /> Ver Transferencia</Button>
                  )}
                </div>

                </CardContent>
            </Card>
            )
        })}
       </div>

       {showTransferModal && selectedTransferImage && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
             <div className="p-4 border-b flex justify-between items-center">
               <h3 className="text-lg font-semibold">Comprobante de Transferencia</h3>
               <Button variant="ghost" size="icon" onClick={handleCloseTransferModal} className="h-8 w-8"><X className="h-4 w-4" /></Button>
             </div>
             <div className="p-4">
               <img src={selectedTransferImage} alt="Comprobante de transferencia" className="w-full h-auto rounded-lg border" />
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
