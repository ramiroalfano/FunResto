"use client"

import { useState } from "react"
import { User, GraduationCap, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserProfile {
  parentName: string
  email: string
  phone: string
  childName: string
  course: string
  dislikes: string[]
}

export function MyAccount() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    parentName: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+54 11 1234-5678",
    childName: "Sofía González",
    course: "4to Grado A",
    dislikes: ["Brócoli", "Pescado", "Espinaca", "Coliflor"],
  })

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)
  const [newDislike, setNewDislike] = useState("")

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    setNewDislike("")
  }

  const addDislike = () => {
    if (newDislike.trim() && !editedProfile.dislikes.includes(newDislike.trim())) {
      setEditedProfile({
        ...editedProfile,
        dislikes: [...editedProfile.dislikes, newDislike.trim()],
      })
      setNewDislike("")
    }
  }

  const removeDislike = (dislike: string) => {
    setEditedProfile({
      ...editedProfile,
      dislikes: editedProfile.dislikes.filter((d) => d !== dislike),
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Mi Cuenta</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar
            </Button>
            <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Datos del Padre/Madre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Datos del Responsable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="parentName">Nombre Completo</Label>
              {isEditing ? (
                <Input
                  id="parentName"
                  value={editedProfile.parentName}
                  onChange={(e) => setEditedProfile({ ...editedProfile, parentName: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-foreground font-medium">{profile.parentName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-muted-foreground">{profile.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-muted-foreground">{profile.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Datos del Hijo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Datos del Estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="childName">Nombre del Hijo/a</Label>
              {isEditing ? (
                <Input
                  id="childName"
                  value={editedProfile.childName}
                  onChange={(e) => setEditedProfile({ ...editedProfile, childName: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-foreground font-medium">{profile.childName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="course">Curso</Label>
              {isEditing ? (
                <Input
                  id="course"
                  value={editedProfile.course}
                  onChange={(e) => setEditedProfile({ ...editedProfile, course: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-muted-foreground">{profile.course}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferencias Alimentarias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias Alimentarias</CardTitle>
          <p className="text-sm text-muted-foreground">Comidas que no le gustan a {profile.childName}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(isEditing ? editedProfile.dislikes : profile.dislikes).map((dislike, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {dislike}
                {isEditing && (
                  <button onClick={() => removeDislike(dislike)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {(isEditing ? editedProfile.dislikes : profile.dislikes).length === 0 && (
              <p className="text-muted-foreground text-sm">No hay restricciones alimentarias registradas</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Agregar comida que no le gusta..."
                value={newDislike}
                onChange={(e) => setNewDislike(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addDislike()}
                className="flex-1"
              />
              <Button onClick={addDislike} disabled={!newDislike.trim()}>
                Agregar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
