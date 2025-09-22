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
  XCircle,
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
      (order.childName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.course?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.parentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.parentEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Panel de Administración</h2>
        <div className="text-center py-12 bg-card border rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No hay pedidos registrados</h3>
          <p className="text-sm text-muted-foreground mt-2">Los nuevos pedidos de los usuarios aparecerán aquí.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Panel de Administración</h2>

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
            <SelectTrigger><SelectValue placeholder="Filtrar por estado" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="rejected">Rechazado</SelectItem>
                <SelectItem value="not_delivered">No Entregado</SelectItem>
            </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger><SelectValue placeholder="Filtrar por pago" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos de pago</SelectItem>
            <SelectItem value="cash">Efectivo</SelectItem>
            <SelectItem value="transfer">Transferencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
            const { text: statusText, color: statusColor, Icon: StatusIcon } = getStatusInfo(order.status)
            return (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="p-4 bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                        <CardTitle className="text-base sm:text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /><span>{new Date(order.date).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'})}</span></div>
                            <div className="font-bold text-foreground">${(order.total || 0).toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <Badge className={`${statusColor} flex-shrink-0`}><StatusIcon className="w-3.5 h-3.5 mr-1.5" />{statusText}</Badge>
                      <Badge className={`${getPaymentStatusColor(order.paymentStatus)} flex-shrink-0`}>{order.paymentMethod === 'transfer' ? <Banknote className="w-3.5 h-3.5 mr-1.5" /> : <CreditCard className="w-3.5 h-3.5 mr-1.5" />}{order.paymentStatus === "pagado" ? "Pagado" : "Pago Pendiente"}</Badge>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                        <h4 className="font-semibold text-muted-foreground text-xs uppercase">Estudiante</h4>
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> <span className="font-medium text-foreground">{order.childName}</span></div>
                        <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /> <span className="text-foreground">{order.course}</span></div>
                    </div>

                    <div className="space-y-2 text-sm">
                         <h4 className="font-semibold text-muted-foreground text-xs uppercase">Responsable</h4>
                        <div className="font-medium text-foreground">{order.parentName}</div>
                        <div className="text-muted-foreground">{order.parentEmail}</div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-muted-foreground text-xs uppercase">Días de Comida ({order.selectedDays.length})</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {order.selectedDays.map((day) => (<Badge key={day} variant="outline" className="font-mono text-xs">{new Date(day).toLocaleDateString('es-ES', { day: '2-digit', month: 'short'})}</Badge>))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm"><MoreHorizontal className="h-4 w-4 mr-2" /> Acciones</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateOrderStatus(order.id, "approved")}><CheckCircle className="mr-2 h-4 w-4" /> Aprobar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateOrderStatus(order.id, "delivered")}><Truck className="mr-2 h-4 w-4" /> Marcar como Entregado</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateOrderStatus(order.id, "completed")}><PackageCheck className="mr-2 h-4 w-4" /> Marcar como Completado</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateOrderStatus(order.id, "pending")}><Clock className="mr-2 h-4 w-4" /> Poner en Pendiente</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateOrderStatus(order.id, "rejected")}><XCircle className="mr-2 h-4 w-4" /> Rechazar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateOrderStatus(order.id, "not_delivered")}><XCircle className="mr-2 h-4 w-4" /> Marcar como No Entregado</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => onDeleteOrder(order.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar Pedido
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {order.paymentMethod === 'transfer' && order.transferImage && (
                    <Button size="sm" variant="outline" onClick={() => handleViewTransferImage(order.transferImage!)}><Banknote className="h-4 w-4 mr-2" /> Ver Comprobante</Button>
                  )}
                </div>

                </CardContent>
            </Card>
            )
        })}
       </div>

       {showTransferModal && selectedTransferImage && (
         <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={handleCloseTransferModal}>
           <div className="bg-card rounded-lg max-w-lg w-full shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
             <div className="p-4 border-b flex justify-between items-center">
               <h3 className="text-lg font-semibold">Comprobante de Transferencia</h3>
               <Button variant="ghost" size="icon" onClick={handleCloseTransferModal}><X className="h-4 w-4" /></Button>
             </div>
             <div className="p-4 bg-muted">
               <img src={selectedTransferImage} alt="Comprobante de transferencia" className="w-full h-auto rounded-lg border" />
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
