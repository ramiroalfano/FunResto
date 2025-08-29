"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"

const mealCategories = ["Todas", "Carnes", "Pollo", "Pescado", "Pasta"]

const meals = [
  {
    id: 1,
    name: "Lunes",
    description: "Milanesas de pollo con pure",
    image: "/milanesas.jpg",
    category: "Pollo",
    protein: "Las imagenes son a modo ilustrativo",
  },
  {
    id: 2,
    name: "Martes",
    description: "Fideos con salsa a eleccion",
    image: "/fideos.jpg",
    category: "Pasta",
    protein: "Las imagenes son a modo ilustrativo",
  },
  {
    id: 3,
    name: "Miercoles",
    description: "Bifes grille con papas doradas",
    image: "/bifes.jpg",
    category: "Carnes",
    protein: "Las imagenes son a modo ilustrativo",
  },
  {
    id: 4,
    name: "Jueves",
    description: "Tacos y Quesadillas",
    image: "/tacos.jpg",
    category: "Pasta",
    protein: "Las imagenes son a modo ilustrativo",
  },
]

export function MealGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const filteredMeals =
    selectedCategory === "Todas" ? meals : meals.filter((meal) => meal.category === selectedCategory)

  const toggleFavorite = (mealId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(mealId)) {
      newFavorites.delete(mealId)
    } else {
      newFavorites.add(mealId)
    }
    setFavorites(newFavorites)
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {mealCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-2">Menú del Día</h3>
        <p className="text-sm text-muted-foreground">
          Estas son las opciones disponibles para los días que selecciones. Cada día recibirás una vianda de las
          opciones mostradas según disponibilidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeals.map((meal) => (
          <Card key={meal.id} className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={meal.image || "/placeholder.svg"} alt={meal.name} className="w-full h-64 object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-2 right-2 ${
                  favorites.has(meal.id) ? "text-accent hover:text-accent" : "text-white hover:text-accent"
                }`}
                onClick={() => toggleFavorite(meal.id)}
              >
                <Heart className={`h-5 w-5 ${favorites.has(meal.id) ? "fill-current" : ""}`} />
              </Button>
            </div>
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center mb-2">
                <h3 className="font-semibold text-card-foreground mb-2">{meal.name}</h3>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {meal.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
              <div className="flex flex-col items-center mb-3">
                <div className="text-xs text-muted-foreground">
                  <span>{meal.protein}</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <span className="text-lg font-bold text-primary"></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
