"use client"

import { useState } from "react"
import { SidebarNav } from "../components/sidebar-nav"
import { Header } from "../components/header"
import { WeeklyPlanner } from "../components/weekly-planner"
import { MealGrid } from "../components/meal-grid"
import { Cart } from "../components/cart"
import { CheckoutModal } from "../components/checkout-modal"
import { MyOrders } from "../components/my-orders"

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

  const renderMainContent = () => {
    switch (activeSection) {
      case "mis-pedidos":
        return <MyOrders orders={orders} />
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
        <Header onMenuToggle={toggleSidebar} />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6">{renderMainContent()}</main>
          {activeSection === "viandas" && <Cart selectedDays={selectedDays} onCheckout={handleCheckout} />}
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={handleCloseCheckout} selectedDays={selectedDays} total={total} />
    </div>
  )
}
