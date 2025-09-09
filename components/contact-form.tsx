'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log({ name, email, message })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">¡Gracias por tu mensaje!</h2>
        <p>Nos pondremos en contacto contigo a la brevedad.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Contacto</h2>
      <p className="mb-4 text-muted-foreground">
        Si tienes alguna duda o sugerencia, no dudes en escribirnos.
      </p>
      <div className="mb-4">
        <p><strong>Teléfono:</strong> +54 9 11 1234-5678</p>
        <p><strong>Email:</strong> info@funfood.com</p>
        <p><strong>Dirección:</strong> Mendoza, ARGENTINA</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Enviar Mensaje</Button>
      </form>
    </div>
  )
}
