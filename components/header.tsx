"use client"

import { Search, Menu, User, ShoppingCart, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuToggle: () => void
  onCartToggle?: () => void
  selectedDaysCount?: number
  onAccountClick?: () => void
  onContactClick?: () => void
}

export function Header({
  onMenuToggle,
  onCartToggle,
  selectedDaysCount = 0,
  onAccountClick,
  onContactClick,
}: HeaderProps) {
  return (
    <div className="bg-card p-4 flex items-center gap-4 border-b border-border">
      <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input type="text" placeholder="Buscar viandas, ingredientes..." className="pl-10 w-full bg-input" />
      </div>

      <div className="flex items-center gap-4">
        {onCartToggle && (
          <Button variant="ghost" size="icon" onClick={onCartToggle} className="relative">
            <ShoppingCart className="h-5 w-5" />
            {selectedDaysCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {selectedDaysCount}
              </span>
            )}
          </Button>
        )}

        <Button variant="ghost" onClick={onContactClick} className="flex items-center gap-2 hover:bg-accent">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground hidden sm:inline">Contacto</span>
        </Button>

        <Button variant="ghost" onClick={onAccountClick} className="flex items-center gap-2 hover:bg-accent">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-foreground">Mi Cuenta</span>
        </Button>
      </div>
    </div>
  )
}
