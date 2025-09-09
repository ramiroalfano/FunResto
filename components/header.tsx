'use client'

import { Menu, ShoppingCart, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { GoogleLogin } from "./google-login"
import { User } from "firebase/auth"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface HeaderProps {
  onMenuToggle: () => void
  onCartToggle?: () => void
  selectedDaysCount: number
  user: User | null
  onSignOut: () => void
  onAdminLoginClick: () => void
  onContactClick: () => void
}

export function Header({
  onMenuToggle,
  onCartToggle,
  selectedDaysCount,
  user,
  onSignOut,
  onAdminLoginClick,
  onContactClick
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="md:hidden" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="hidden md:flex items-center gap-2">
        <Button variant="ghost" onClick={onContactClick}>Contacto</Button>
      </nav>

      <div className="flex items-center gap-4">
        {onCartToggle && (
          <Button variant="outline" size="icon" className="relative" onClick={onCartToggle}>
            <ShoppingCart className="h-5 w-5" />
            {selectedDaysCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {selectedDaysCount}
              </span>
            )}
          </Button>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Avatar"} />
                  <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <GoogleLogin onAdminClick={onAdminLoginClick} />
        )}
      </div>
    </header>
  )
}
