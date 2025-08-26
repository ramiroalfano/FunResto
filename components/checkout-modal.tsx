"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Lock, Calendar, User, GraduationCap } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: (orderData?: { childName: string; course: string }) => void // Modified onClose to accept order data
  selectedDays: string[]
  total: number
}

export function CheckoutModal({ isOpen, onClose, selectedDays, total }: CheckoutModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    childName: "",
    course: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePayment = () => {
    // Simular procesamiento de pago
    setTimeout(() => {
      setStep(4)
    }, 2000)
  }

  const handleOrderComplete = () => {
    const orderData = {
      childName: formData.childName,
      course: formData.course,
    }
    // Reset form and step
    setStep(1)
    setFormData({
      email: "",
      phone: "",
      name: "",
      address: "",
      childName: "",
      course: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
    })
    onClose(orderData) // Pass order data to parent component
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      email: "",
      phone: "",
      name: "",
      address: "",
      childName: "",
      course: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            Checkout Seguro
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+54 11 1234-5678"
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección de Entrega</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Calle, número, ciudad"
                />
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-orange-600" />
                  Información del Estudiante
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="childName">Nombre del Hijo/a</Label>
                    <Input
                      id="childName"
                      value={formData.childName}
                      onChange={(e) => handleInputChange("childName", e.target.value)}
                      placeholder="Nombre completo del estudiante"
                    />
                  </div>
                  <div>
                    <Label htmlFor="course">Curso</Label>
                    <Input
                      id="course"
                      value={formData.course}
                      onChange={(e) => handleInputChange("course", e.target.value)}
                      placeholder="Ej: 5to Grado A, 2do Año B"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleNextStep} className="w-full bg-orange-600 hover:bg-orange-700">
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resumen de Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Estudiante:
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Nombre:</span> {formData.childName || "No especificado"}
                  </p>
                  <p>
                    <span className="font-medium">Curso:</span> {formData.course || "No especificado"}
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Días Seleccionados:</h3>
                <div className="space-y-2">
                  {selectedDays.map((day, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{day}</span>
                      <span className="text-sm font-medium">$15.99</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrevStep} className="flex-1 bg-transparent">
                  Atrás
                </Button>
                <Button onClick={handleNextStep} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Continuar al Pago
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                <Input
                  id="cardName"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange("cardName", e.target.value)}
                  placeholder="Como aparece en la tarjeta"
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                  <Input
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrevStep} className="flex-1 bg-transparent">
                  Atrás
                </Button>
                <Button onClick={handlePayment} className="flex-1 bg-green-600 hover:bg-green-700">
                  Pagar ${total.toFixed(2)}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">¡Pago Exitoso!</h3>
              <p className="text-gray-600 mb-4">Tu orden ha sido confirmada. Recibirás un email con los detalles.</p>
              <p className="text-sm text-gray-500 mb-6">
                Número de orden: #VD{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <Button onClick={handleOrderComplete} className="w-full bg-orange-600 hover:bg-orange-700">
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
