'use client'

import { User } from "firebase/auth"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface MyAccountProps {
  user: User | null;
}

export function MyAccount({ user }: MyAccountProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Mi Cuenta</h1>
      {user ? (
        <div className="bg-card p-6 rounded-lg border border-border flex items-center space-x-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Avatar"} />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">{user.displayName || "Usuario"}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-green-500 font-semibold pt-2">Cuenta verificada</p>
          </div>
        </div>
      ) : (
        <div className="bg-card p-6 rounded-lg border border-border text-center">
          <p className="text-muted-foreground">Por favor, inicia sesión para ver la información de tu cuenta.</p>
        </div>
      )}
    </div>
  )
}
