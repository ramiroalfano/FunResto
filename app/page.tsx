"use client"

import { useState } from "react"
import { SidebarNav } from "../components/sidebar-nav"
import { Header } from "../components/header"
import { WeeklyPlanner } from "../components/weekly-planner"
import { MealGrid } from "../components/meal-grid"
import { Cart } from "../components/cart"
import { CheckoutModal } from "../components/checkout-modal"
import { MyOrders } from "../components/my-orders"
import { MyAccount } from "../components/my-account"
import { WhatsAppFloat } from "../components/whatsapp-float" // Importado componente WhatsApp

interface Order {
  id: string
  childName: string
  course: string
  selectedDays: string[]
  totalAmount: number
  date: string
  status: "completed" | "pending" | "delivered"
}

export default function MealDeliveryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("viandas")
  const [orders, setOrders] = useState<Order[]>([])

  const getPricePerDay = (totalDays: number) => {
    if (totalDays >= 1 && totalDays <= 3) {
      return 6000
    } else if (totalDays >= 4 && totalDays <= 8) {
      return 5000
    } else if (totalDays >= 9 && totalDays <= 16) {
      return 4500
    }
    return 4500
  }

  const pricePerDay = getPricePerDay(selectedDays.length)
  const subtotal = selectedDays.length * pricePerDay
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const handleDaySelection = (days: string[]) => {
    setSelectedDays(days)
  }

  const handleCheckout = () => {
    setIsCheckoutOpen(true)
  }

  const handleCloseCheckout = (orderData?: { childName: string; course: string }) => {
    if (orderData && selectedDays.length > 0) {
      const checkoutPricePerDay = getPricePerDay(selectedDays.length)
      const checkoutSubtotal = selectedDays.length * checkoutPricePerDay
      const checkoutTax = checkoutSubtotal * 0.05
      const checkoutTotal = checkoutSubtotal + checkoutTax

      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        childName: orderData.childName,
        course: orderData.course,
        selectedDays: [...selectedDays],
        totalAmount: checkoutTotal,
        date: new Date().toLocaleDateString("es-ES"),
        status: "completed",
      }
      setOrders((prev) => [newOrder, ...prev])
    }
    setIsCheckoutOpen(false)
    setSelectedDays([])
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  const handleAccountClick = () => {
    setActiveSection("mi-cuenta")
    setIsSidebarOpen(false)
  }

  const handleContactClick = () => {
    setActiveSection("contacto")
    setIsSidebarOpen(false)
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "mis-pedidos":
        return <MyOrders orders={orders} />
      case "mi-cuenta":
        return <MyAccount />
      case "contacto": // Agregado caso para contacto
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Contacto</h1>
            <div className="bg-card p-6 rounded-lg border border-border space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Información de Contacto</h3>
                <p className="text-muted-foreground">📞 Teléfono: +54 11 2345-6789</p>
                <p className="text-muted-foreground">📧 Email: info@viandasexpress.com</p>
                <p className="text-muted-foreground">📍 Dirección: Av. Corrientes 1234, CABA</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Horarios de Atención</h3>
                <p className="text-muted-foreground">Lunes a Viernes: 8:00 - 18:00</p>
                <p className="text-muted-foreground">Sábados: 9:00 - 14:00</p>
              </div>
            </div>
          </div>
        )
      case "viandas":
      default:
        return (
          <>
            <WeeklyPlanner selectedDays={selectedDays} onDaySelection={handleDaySelection} />
            <MealGrid />
          </>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-30 h-full`}
      >
        <SidebarNav onClose={closeSidebar} activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleSidebar} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuToggle={toggleSidebar}
          onCartToggle={activeSection === "viandas" ? toggleCart : undefined}
          selectedDaysCount={selectedDays.length}
          onAccountClick={handleAccountClick} // Conectado botón Mi Cuenta
          onContactClick={handleContactClick} // Conectado botón Contacto
        />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6">{renderMainContent()}</main>
          {activeSection === "viandas" && (
            <>
              <div className="hidden md:block">
                <Cart selectedDays={selectedDays} onCheckout={handleCheckout} />
              </div>
              <div
                className={`${isCartOpen ? "translate-x-0" : "translate-x-full"} md:hidden transition-transform duration-300 ease-in-out fixed right-0 top-0 z-30 h-full w-80 bg-card shadow-lg`}
              >
                <Cart selectedDays={selectedDays} onCheckout={handleCheckout} onClose={closeCart} />
              </div>
            </>
          )}
        </div>
      </div>

      {isCartOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleCart} />}

      <CheckoutModal isOpen={isCheckoutOpen} onClose={handleCloseCheckout} selectedDays={selectedDays} total={total} />

      <WhatsAppFloat />
    </div>
  )
}
