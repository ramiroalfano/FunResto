"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"

const mealCategories = ["Todas", "Carnes", "Pollo", "Pescado", "Vegetariano", "Vegano", "Pasta"]

const meals = [
  {
    id: 1,
    name: "Pollo Grillado con Verduras",
    description: "Pechuga de pollo a la plancha con mix de vegetales salteados",
    price: 2500,
    image: "/grilled-chicken-vegetables.png",
    category: "Pollo",
    calories: 420,
    protein: "35g",
  },
  {
    id: 2,
    name: "Salmón con Quinoa",
    description: "Filete de salmón al horno con quinoa y espárragos",
    price: 3200,
    image: "/salmon-with-quinoa-and-asparagus.png",
    category: "Pescado",
    calories: 480,
    protein: "40g",
  },
  {
    id: 3,
    name: "Bowl Vegano Completo",
    description: "Garbanzos, quinoa, palta, tomate cherry y aderezo tahini",
    price: 2200,
    image: "/vegan-bowl-with-chickpeas-quinoa-avocado.png",
    category: "Vegano",
    calories: 380,
    protein: "18g",
  },
  {
    id: 4,
    name: "Pasta con Pollo y Pesto",
    description: "Penne con tiras de pollo, salsa pesto y tomates secos",
    price: 2800,
    image: "/pasta-with-chicken-and-pesto-sauce.png",
    category: "Pasta",
    calories: 520,
    protein: "28g",
  },
  {
    id: 5,
    name: "Bife con Puré de Batata",
    description: "Bife de chorizo con puré de batata y ensalada verde",
    price: 3500,
    image: "/beef-steak-with-sweet-potato-mash.png",
    category: "Carnes",
    calories: 580,
    protein: "45g",
  },
  {
    id: 6,
    name: "Ensalada Mediterránea",
    description: "Mix de hojas verdes, queso feta, aceitunas y vinagreta",
    price: 1800,
    image: "/mediterranean-salad.png",
    category: "Vegetariano",
    calories: 320,
    protein: "12g",
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
              <img src={meal.image || "/placeholder.svg"} alt={meal.name} className="w-full h-48 object-cover" />
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
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-card-foreground">{meal.name}</h3>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {meal.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{meal.calories} cal</span>
                  <span>{meal.protein} proteína</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">${meal.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
