"use client"

import { UtensilsCrossed, Calendar, ShoppingBag, Heart, Settings, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: UtensilsCrossed, label: "Viandas", color: "text-primary", active: true },
  { icon: Calendar, label: "Mi Planificación", color: "text-sidebar-foreground" },
  { icon: ShoppingBag, label: "Mis Pedidos", color: "text-sidebar-foreground" },
  { icon: Heart, label: "Favoritos", color: "text-sidebar-foreground" },
  { icon: Settings, label: "Configuración", color: "text-sidebar-foreground" },
]

interface SidebarNavProps {
  onClose?: () => void
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function SidebarNav({ onClose, activeSection = "viandas", onSectionChange }: SidebarNavProps) {
  return (
    <div className="w-64 bg-sidebar p-4 border-r border-sidebar-border h-screen relative">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-sidebar-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-sidebar-foreground">VIANDAS EXPRESS</span>
      </div>

      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant={item.label.toLowerCase().replace(" ", "-") === activeSection ? "default" : "ghost"}
            className={`w-full justify-start ${item.label.toLowerCase().replace(" ", "-") === activeSection ? "bg-sidebar-primary text-sidebar-primary-foreground" : item.color}`}
            onClick={() => {
              onSectionChange?.(item.label.toLowerCase().replace(" ", "-"))
              onClose?.()
            }}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <Button variant="ghost" className="w-full justify-start mt-auto text-sidebar-foreground absolute bottom-4">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </div>
  )
}
