"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue"]
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

interface WeeklyPlannerProps {
  selectedDays?: string[]
  onDaySelection?: (days: string[]) => void
  onOpenCart?: () => void
}

export function WeeklyPlanner({ selectedDays = [], onDaySelection, onOpenCart }: WeeklyPlannerProps) {
  const [currentWeek, setCurrentWeek] = useState(0)
  const selectedDaysSet = new Set(selectedDays)

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + currentWeek * 7)

  const weekDays = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const toggleDay = (dateString: string) => {
    const newSelected = new Set(selectedDays)
    if (newSelected.has(dateString)) {
      newSelected.delete(dateString)
    } else {
      newSelected.add(dateString)
    }
    onDaySelection?.(Array.from(newSelected))
  }

  const handleBuyDays = () => {
    if (selectedDays.length > 0) {
      onOpenCart?.()
    }
  }

  const getPricePerDay = (totalDays: number) => {
    if (totalDays >= 1 && totalDays <= 3) {
      return 6000
    } else if (totalDays >= 4 && totalDays <= 8) {
      return 5000
    } else if (totalDays >= 9 && totalDays <= 16) {
      return 4500
    }
    return 4500 // precio por defecto para más de 16 días
  }

  return (
    <Card className="mb-6 bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Calendar className="h-5 w-5" />
            Planifica tus Viandas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="border-border"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-card-foreground min-w-[120px] text-center">
              {months[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="border-border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {weekDays.map((date, index) => {
            const dateString = date.toISOString().split("T")[0]
            const isSelected = selectedDaysSet.has(dateString)
            const isToday = date.toDateString() === today.toDateString()

            return (
              <Button
                key={dateString}
                variant={isSelected ? "default" : "outline"}
                className={`flex flex-col p-3 h-auto ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "border-primary text-primary"
                      : "border-border text-card-foreground hover:bg-orange-100 hover:border-orange-300"
                }`}
                onClick={() => toggleDay(dateString)}
              >
                <span className="text-xs font-medium">{daysOfWeek[index]}</span>
                <span className="text-lg font-bold">{date.getDate()}</span>
              </Button>
            )
          })}
        </div>
        {selectedDays.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Días seleccionados: <span className="font-medium text-foreground">{selectedDays.length}</span>
            </p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <div>
                <p className="text-lg font-bold text-foreground">
                  Total: ${(selectedDays.length * getPricePerDay(selectedDays.length)).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${getPricePerDay(selectedDays.length).toLocaleString()} por día × {selectedDays.length} días
                </p>
                {selectedDays.length >= 4 && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {selectedDays.length >= 9 ? "¡Descuento por volumen aplicado!" : "¡Descuento aplicado!"}
                  </p>
                )}
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleBuyDays}>
                Comprar Días Seleccionados
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
