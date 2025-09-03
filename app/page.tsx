"use client"

import { useState, useEffect } from "react"
import { SidebarNav } from "../components/sidebar-nav"
import { Header } from "../components/header"
import { WeeklyPlanner } from "../components/weekly-planner"
import { MealGrid } from "../components/meal-grid"
import { Cart } from "../components/cart"
import { CheckoutModal } from "../components/checkout-modal"
import { MyOrders } from "../components/my-orders"
import { MyAccount } from "../components/my-account"
import { AdminOrders } from "../components/admin-orders"
import { AdminLogin } from "../components/admin-login"
import { WhatsAppFloat } from "../components/whatsapp-float"
import { auth } from "../lib/firebaseConfig"
import { onAuthStateChanged, User } from "firebase/auth"
import { createOrder, uploadFile, listenOrders, Order } from "../lib/ordersService"

export default function MealDeliveryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "cash">("mercadopago")
  const [activeSection, setActiveSection] = useState("viandas")
  const [orders, setOrders] = useState<(Order & { id: string })[]>([])
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = listenOrders(setOrders)
      return () => unsubscribe()
    }
  }, [currentUser])

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
  const total = selectedDays.length * pricePerDay

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
    setPaymentMethod("mercadopago")
    setIsCheckoutOpen(true)
  }

  const handleCashPayment = async (receipt: File) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para realizar un pedido.")
      return
    }

    try {
      const receiptUrl = await uploadFile(receipt, `receipts/${currentUser.uid}/${Date.now()}`)
      const newOrder = {
        items: selectedDays.map((day) => ({ day, price: pricePerDay })),
        total,
        userId: currentUser.uid,
        status: "pending",
        receiptUrl,
        paymentMethod: "efectivo",
        paymentStatus: "pendiente",
        createdAt: new Date().toISOString(),
      }
      await createOrder(newOrder)
      alert("Pedido realizado con éxito. Esperando aprobación del administrador.")
      setSelectedDays([])
      setIsCartOpen(false)
    } catch (error: any) {
      console.error("Error al realizar el pedido:", error)
      alert(`Ocurrió un error al procesar tu pedido: ${error.message}`)
    }
  }

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false)
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

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true)
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "mis-pedidos":
        return <MyOrders orders={orders}/>
      case "mi-cuenta":
        return <MyAccount />
      case "admin":
        return isAdminAuthenticated ? <AdminOrders orders={orders} /> : <AdminLogin onLogin={handleAdminLogin} />
      case "contacto":
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
            <WeeklyPlanner selectedDays={selectedDays} onDaySelection={handleDaySelection} onOpenCart={toggleCart} />
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
          onAccountClick={handleAccountClick}
          onContactClick={handleContactClick}
        />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6">{renderMainContent()}</main>
          {activeSection === "viandas" && (
            <>
              <div
                className={`${isCartOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out fixed right-0 top-0 z-30 h-full w-80 bg-card shadow-lg`}
              >
                <Cart
                  selectedDays={selectedDays}
                  onCheckout={handleCheckout}
                  onCashPayment={handleCashPayment}
                  onClose={closeCart}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {isCartOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleCart} />}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        selectedDays={selectedDays}
        total={total}
        paymentMethod={paymentMethod}
      />

      <WhatsAppFloat />
    </div>
  )
}
