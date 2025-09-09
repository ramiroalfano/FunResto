'use client'

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onAdminLogin: (email: string, pass: string) => Promise<void>
}

export function AdminLoginModal({ isOpen, onClose, onAdminLogin }: AdminLoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)
    try {
      await onAdminLogin(email, password)
      onClose()
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, intente de nuevo.")
      console.error(err)
    }
    setIsProcessing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-sm m-4">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Acceso Admin</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isProcessing} className="w-full">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ingresar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
