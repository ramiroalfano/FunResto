"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, Edit2, Calendar, X, Banknote } from "lucide-react"

const cartItems = [
  { title: "Original Chess Meat Burger With Chips (Non Veg)", price: 23.99, quantity: 1 },
  { title: "Fresh Orange Juice With Basil Seed No Sugar (Veg)", price: 12.99, quantity: 1 },
  { title: "Meat Sushi Maki With Tuna, Ship And Other (Non Veg)", price: 9.99, quantity: 1 },
  { title: "Tacos Salsa With Chickens Grilled", price: 14.99, quantity: 1 },
]

export function Cart({
  selectedDays = [],
  onCheckout,
  onCashPayment,
  onTransferPayment,
  onClose,
}: {
  selectedDays?: string[]
  onCheckout?: () => void
  onCashPayment?: () => void
  onTransferPayment?: () => void
  onClose?: () => void
}) {
  const getPricePerDay = (totalDays: number) => {
    if (totalDays >= 1 && totalDays <= 3) {
      return 6000
    } else if (totalDays >= 4 && totalDays <= 8) {
      return 5000
    } else if (totalDays >= 9 && totalDays <= 16) {
      return 4500
    }
    return 4500
  }

  const pricePerDay = getPricePerDay(selectedDays.length)
  const total = selectedDays.length * pricePerDay

  return (
    <div className="w-full max-w-full sm:max-w-[420px] h-screen bg-white border-l flex flex-col shadow-lg overflow-hidden overflow-x-hidden min-w-0">
      <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold">Tu Orden</h2>
          <p className="text-sm text-gray-500">
            {selectedDays.length > 0 ? "Viandas Seleccionadas" : "Selecciona días para comenzar"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Edit2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {selectedDays.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Selecciona días para ver tu orden</p>
          </div>
        </div>
      )}

      {selectedDays.length > 0 && (
        <>
          <div className="flex-1 overflow-y-auto p-4 overflow-x-hidden">
            {selectedDays.map((day, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg mb-3 bg-gray-50 min-w-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium mb-1 break-words">
                    {new Date(day).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">Menú del día incluido</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">1 día</span>
                    <span className="text-orange-600 font-bold text-lg">${pricePerDay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 flex-shrink-0 bg-white">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sub Total ({selectedDays.length} días)</span>
                <span className="font-medium">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Amount</span>
                <span className="text-orange-600">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Pago Seguro</span>
              </div>
              <p className="text-xs text-blue-600">Procesado por Mercado Pago - Tarjetas de crédito y débito</p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold"
                onClick={onCheckout}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pagar con Mercado Pago
              </Button>

              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 h-12 font-semibold bg-transparent"
                onClick={onCashPayment}
              >
                <Banknote className="h-5 w-5 mr-2" />
                Pagar en Efectivo
              </Button>

              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 h-12 font-semibold bg-transparent"
                onClick={onTransferPayment}
              >
                <Banknote className="h-5 w-5 mr-2" />
                Pagar por Transferencia
              </Button>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">Elige tu método de pago preferido</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
