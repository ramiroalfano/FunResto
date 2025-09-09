'use client'

import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebaseConfig"
import { User, Shield } from "lucide-react"
import { Button } from "./ui/button"

interface GoogleLoginProps {
  onAdminClick: () => void
}

export function GoogleLogin({ onAdminClick }: GoogleLoginProps) {

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error)
    }
  }

  return (
    <div className="flex items-center space-x-2">
       <Button onClick={handleGoogleSignIn} variant="outline">
         <User className="mr-2 h-4 w-4" />
         Iniciar Sesión
       </Button>
       <Button onClick={onAdminClick} variant="outline">
         <Shield className="mr-2 h-4 w-4" />
         Admin
       </Button>
    </div>
  )
}
