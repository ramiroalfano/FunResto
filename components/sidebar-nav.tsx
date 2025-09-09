'use client'

import {
  Home,
  ShoppingCart,
  Package,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Contact,
} from "lucide-react"
import Image from "next/image"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "../lib/firebaseConfig"
import { useState, useEffect } from "react"

interface SidebarNavProps {
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
  isAdmin: boolean
}

export function SidebarNav({ onClose, activeSection, onSectionChange, isAdmin }: SidebarNavProps) {
  const [user, setUser] = useState(auth.currentUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    onSectionChange("viandas")
    onClose()
  }

  const handleLoginClick = () => {
    // Simplificado para usar el mismo flujo de autenticación
    // La lógica de login está en el Header ahora.
    onClose()
  }

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r border-border p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="FunFood Logo" width={32} height={32} />
          <h2 className="text-2xl font-bold">FunFood</h2>
        </div>
        <button onClick={onClose} className="md:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onSectionChange("viandas")}
          className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeSection === "viandas"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          <Home className="h-4 w-4" />
          Inicio
        </button>

        {user && (
          <>
            <button
              onClick={() => onSectionChange("mis-pedidos")}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeSection === "mis-pedidos"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Package className="h-4 w-4" />
              Mis Pedidos
            </button>
            <button
              onClick={() => onSectionChange("mi-cuenta")}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeSection === "mi-cuenta"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <User className="h-4 w-4" />
              Mi Cuenta
            </button>
            {isAdmin && (
              <button
                onClick={() => onSectionChange("admin")}
                className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "admin"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
          </>
        )}

        <button
          onClick={() => onSectionChange("contacto")}
          className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeSection === "contacto"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          <Contact className="h-4 w-4" />
          Contacto
        </button>
      </nav>
      <div className="mt-auto">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        ) : (
          // El botón de login ahora está en el Header
          <></>
        )}
      </div>
    </div>
  )
}
