"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock, Calendar, User, GraduationCap, ExternalLink } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: (orderData?: { childName: string; course: string }) => void
  selectedDays: string[]
  total: number
}

export function CheckoutModal({ isOpen, onClose, selectedDays, total }: CheckoutModalProps) {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    childName: "",
    course: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step < 2) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleMercadoPagoRedirect = async () => {
    setIsProcessing(true)

    try {
      const preferenceData = {
        items: [
          {
            title: `Viandas para ${formData.childName} - ${formData.course}`,
            description: `Viandas para ${selectedDays.length} días (${selectedDays.join(", ")})`,
            quantity: 1,
            unit_price: total,
          },
        ],
        payer: {
          name: formData.name,
          email: formData.email,
          phone: {
            number: formData.phone,
          },
          address: {
            street_name: formData.address,
          },
        },
        back_urls: {
          success: `${window.location.origin}/payment/success`,
          failure: `${window.location.origin}/payment/failure`,
          pending: `${window.location.origin}/payment/pending`,
        },
        auto_return: "approved",
        external_reference: `viandas-${Date.now()}`,
        metadata: {
          child_name: formData.childName,
          course: formData.course,
          selected_days: selectedDays.join(","),
        },
      }

      const response = await fetch("/api/mercadopago/preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceData),
      })

      const result = await response.json()

      if (result.success && result.init_point) {
        // Redirigir al checkout de Mercado Pago
        window.location.href = result.init_point
      } else {
        console.error("Error creating preference:", result.error)
        alert(`Error al crear la preferencia de pago: ${result.error}`)
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Error al procesar el pago. Por favor, intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
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
                      <span className="text-sm font-medium">${(total / selectedDays.length).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadopago/logo__large.png"
                    alt="Mercado Pago"
                    className="h-6"
                  />
                  <span className="text-sm font-medium">Pago Seguro</span>
                </div>
                <p className="text-xs text-gray-600">
                  Serás redirigido al sitio oficial de Mercado Pago para completar tu pago de forma segura.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrevStep} className="flex-1 bg-transparent">
                  Atrás
                </Button>
                <Button
                  onClick={handleMercadoPagoRedirect}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Redirigiendo..."
                  ) : (
                    <>
                      Pagar con Mercado Pago
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
