'use client'

import { useState, useEffect } from "react"
import { X, Loader2, User, GraduationCap, Image as ImageIcon, CheckCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { User as FirebaseUser } from "firebase/auth"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: (orderData?: {
    childName: string
    course: string
    paymentMethod: string
    transferImage?: string
  }) => void
  selectedDays: string[]
  total: number
  paymentMethod: "mercadopago" | "cash" | "transfer"
  user: FirebaseUser | null
}

export function CheckoutModal({
  isOpen,
  onClose,
  selectedDays,
  total,
  paymentMethod,
  user,
}: CheckoutModalProps) {
  const [step, setStep] = useState(1)
  const [childName, setChildName] = useState("")
  const [course, setCourse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transferImage, setTransferImage] = useState<File | null>(null)
  const [transferImageUrl, setTransferImageUrl] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setChildName("")
      setCourse("")
      setIsProcessing(false)
      setTransferImage(null)
      setTransferImageUrl(undefined)
    } else {
      // Restablecer el estado cuando el modal se cierra por completo
      const timer = setTimeout(() => {
        setStep(1)
        setChildName("")
        setCourse("")
        setTransferImage(null)
        setTransferImageUrl(undefined)
      }, 300) // Esperar a que la animación de cierre termine
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNextStep = () => {
    if (childName.trim() && course.trim()) {
      setStep(2)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTransferImage(e.target.files[0])
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    if (paymentMethod === "transfer" && transferImage) {
      try {
        const storage = getStorage()
        const storageRef = ref(
          storage,
          `transfers/${user?.uid}_${Date.now()}_${transferImage.name}`
        )
        const snapshot = await uploadBytes(storageRef, transferImage)
        const downloadURL = await getDownloadURL(snapshot.ref)
        setTransferImageUrl(downloadURL)
        setStep(3) // Avanzar a confirmación
      } catch (error) {
        console.error("Error subiendo la imagen:", error)
        alert("Error al subir la imagen. Por favor, intenta de nuevo.")
        setIsProcessing(false)
        return
      }
    } else if (paymentMethod === "mercadopago") {
      const preferenceData = {
        items: [
          {
            title: `Viandas para ${childName}`,
            quantity: selectedDays.length,
            unit_price: total / selectedDays.length,
          },
        ],
        payer: {
          email: user?.email,
        },
        back_urls: {
          success: `${window.location.origin}?status=success`,
          failure: `${window.location.origin}?status=failure`,
        },
        auto_return: "approved",
      }
      try {
        const response = await fetch("/api/mercadopago/preference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferenceData),
        })
        const result = await response.json()
        if (result.success && result.init_point) {
          window.location.href = result.init_point
        } else {
          console.error("Error creating preference:", result.error)
          alert(`Error al crear la preferencia de pago: ${result.error}`)
        }
      } catch (error) {
        console.error("Error processing payment:", error)
        alert("Error al procesar el pago. Por favor, intenta nuevamente.")
      }
    } else {
      // Para efectivo
      setStep(3)
    }

    setIsProcessing(false)
  }

  const handleConfirmOrder = () => {
    onClose({
      childName,
      course,
      paymentMethod,
      transferImage: transferImageUrl,
    })
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Datos del Estudiante</h3>
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Nombre del niño/a"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="relative">
        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Curso"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button
        onClick={handleNextStep}
        disabled={!childName.trim() || !course.trim()}
        className="w-full"
      >
        Siguiente
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Confirmar Pago</h3>
      <div className="bg-muted p-4 rounded-lg text-sm">
        <div className="flex justify-between">
          <span>Días seleccionados:</span>
          <strong>{selectedDays.length}</strong>
        </div>
        <div className="flex justify-between font-bold text-base mt-2">
          <span>Total a pagar:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      {paymentMethod === "transfer" && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Datos para la Transferencia:</p>
          <div className="bg-gray-100 p-3 rounded-md text-xs">
            <p>CBU: 0123456789012345678901</p>
            <p>Alias: viandas.express.mp</p>
            <p>Titular: Viandas Express S.A.</p>
          </div>
          <p className="text-sm font-medium mt-2">Subir Comprobante:</p>
          <div className="relative border-2 border-dashed rounded-lg p-4 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-1">
              {transferImage ? transferImage.name : "Arrastra o selecciona una imagen"}
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={isProcessing || (paymentMethod === "transfer" && !transferImage)}
        className="w-full"
      >
        {isProcessing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : paymentMethod === "mercadopago" ? (
          "Pagar con Mercado Pago"
        ) : (
          "Confirmar Pedido"
        )}
      </Button>
      <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
        Volver
      </Button>
    </div>
  )

  const renderStep3 = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
      <h3 className="text-lg font-semibold">¡Pedido Confirmado!</h3>
      <p className="text-sm text-muted-foreground">
        {paymentMethod === "cash"
          ? "Tu pedido ha sido registrado. Recuerda realizar el pago en efectivo."
          : "Tu pedido ha sido registrado y el comprobante fue enviado. Recibirás una confirmación cuando se verifique el pago."}
      </p>
      <Button onClick={handleConfirmOrder} className="w-full">
        Finalizar
      </Button>
    </div>
  )

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`bg-card rounded-lg shadow-xl w-full max-w-md m-4 transform transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Finalizar Compra</h2>
          <Button variant="ghost" size="icon" onClick={() => onClose()} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  )
}
