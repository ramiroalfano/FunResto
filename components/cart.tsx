"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, Edit2, Calendar, X } from "lucide-react"

const cartItems = [
  { title: "Original Chess Meat Burger With Chips (Non Veg)", price: 23.99, quantity: 1 },
  { title: "Fresh Orange Juice With Basil Seed No Sugar (Veg)", price: 12.99, quantity: 1 },
  { title: "Meat Sushi Maki With Tuna, Ship And Other (Non Veg)", price: 9.99, quantity: 1 },
  { title: "Tacos Salsa With Chickens Grilled", price: 14.99, quantity: 1 },
]

export function Cart({
  selectedDays = [],
  onCheckout,
  onClose,
}: {
  selectedDays?: string[]
  onCheckout?: () => void
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
  const subtotal = selectedDays.length * pricePerDay
  const tax = subtotal * 0.05
  const total = subtotal + tax

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{selectedDays.length > 0 ? "Tu Orden" : "Table 4"}</h2>
          <p className="text-sm text-gray-500">{selectedDays.length > 0 ? "Viandas Seleccionadas" : "Floyd Miles"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Edit2 className="h-5 w-5" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
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
        <div className="flex-1 overflow-auto p-4">
          {selectedDays.map((day, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">
                  {new Date(day).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}
                </h4>
                <p className="text-xs text-gray-600">Menú del día incluido</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-orange-600 font-bold">${pricePerDay.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">1 día</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDays.length > 0 && (
        <div className="border-t p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sub Total ({selectedDays.length} días)</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax 5%</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Amount</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Pago Seguro</span>
            </div>
            <p className="text-xs text-blue-600">Procesado por Mercado Pago - Tarjetas de crédito y débito</p>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold" onClick={onCheckout}>
            <CreditCard className="h-5 w-5 mr-2" />
            Pagar con Mercado Pago
          </Button>
        </div>
      )}
    </div>
  )
}
