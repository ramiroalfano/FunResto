'use client'

import { useState, useEffect, useCallback } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { WeeklyPlanner } from "@/components/weekly-planner"
import { MealGrid } from "@/components/meal-grid"
import { Cart } from "@/components/cart"
import { CheckoutModal } from "@/components/checkout-modal"
import { MyOrders } from "@/components/my-orders"
import { MyAccount } from "@/components/my-account"
import { AdminOrders } from "@/components/admin-orders"
import { AdminLoginModal } from "@/components/admin-login-modal"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ContactForm } from "@/components/contact-form"
import { auth } from "@/lib/firebaseConfig"
import { createOrder, Order, listenOrders, isCurrentUserAdmin, listenUserOrders, updateOrderStatus } from "@/lib/ordersService"
import { onAuthStateChanged, User, signOut, signInWithEmailAndPassword } from "firebase/auth"

const getPricePerDay = (totalDays: number) => {
  if (totalDays >= 1 && totalDays <= 3) return 6000;
  if (totalDays >= 4 && totalDays <= 8) return 5000;
  if (totalDays >= 9) return 4500;
  return 4500;
};

export default function MealDeliveryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "cash" | "transfer">("mercadopago")
  const [activeSection, setActiveSection] = useState("viandas")
  const [orders, setOrders] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isAdminUser = await isCurrentUserAdmin();
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
        setActiveSection("viandas");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin && activeSection === "viandas") {
      setActiveSection("admin");
    }
  }, [isAdmin, activeSection]);

  useEffect(() => {
    if (isAdmin) {
      const unsubscribe = listenOrders(setOrders);
      return () => unsubscribe();
    } else if (user) {
      const unsubscribe = listenUserOrders(user.uid, setOrders);
      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [isAdmin, user]);

  const pricePerDay = getPricePerDay(selectedDays.length)
  const total = selectedDays.length * pricePerDay

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const handleDaySelection = useCallback((days: string[]) => setSelectedDays(days), []);

  const handleCheckout = useCallback(() => {
    if (!user) {
      alert("Por favor, inicia sesión para continuar con la compra.");
      return;
    }
    setPaymentMethod("mercadopago")
    setIsCheckoutOpen(true)
  }, [user]);

  const handleCashPayment = useCallback(() => {
    if (!user) {
      alert("Por favor, inicia sesión para continuar con la compra.");
      return;
    }
    setPaymentMethod("cash")
    setIsCheckoutOpen(true)
  }, [user]);

  const handleTransferPayment = useCallback(() => {
    if (!user) {
      alert("Por favor, inicia sesión para continuar con la compra.");
      return;
    }
    setPaymentMethod("transfer")
    setIsCheckoutOpen(true)
  }, [user]);

  const handleCloseCheckout = useCallback(async (orderData?: { childName: string; course: string; paymentMethod: string; transferImage?: string }) => {
    if (orderData && selectedDays.length > 0 && user) {
      const checkoutPricePerDay = getPricePerDay(selectedDays.length)
      const checkoutTotal = selectedDays.length * checkoutPricePerDay

      const newOrder: Omit<Order, 'id'> = {
        userId: user.uid,
        items: selectedDays.map(day => ({
          title: `Vianda para ${new Date(day).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}`,
          price: checkoutPricePerDay,
          quantity: 1,
        })),
        total: checkoutTotal,
        childName: orderData.childName,
        course: orderData.course,
        selectedDays: [...selectedDays],
        date: new Date().toISOString(),
        status: "pending",
        paymentMethod: orderData.paymentMethod as any,
        paymentStatus: (orderData.paymentMethod === "mercadopago") ? "pagado" : "pendiente",
        parentName: user.displayName || "",
        parentEmail: user.email || "",
        parentPhone: user.phoneNumber || "",
        ...(orderData.transferImage && { transferImage: orderData.transferImage })
      };

      try {
        await createOrder(newOrder);
      } catch (error) {
        console.error("Error guardando el pedido:", error)
      }
    }
    setIsCheckoutOpen(false)
    setSelectedDays([])
  }, [selectedDays, user]);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section)
    closeSidebar();
  }, [closeSidebar]);

  const handleContactClick = useCallback(() => {
    setActiveSection("contacto")
    closeSidebar();
  }, [closeSidebar]);
  
  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }, []);

  const handleAdminLogin = useCallback(async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Error al iniciar sesión como admin:", error);
    }
  }, []);

  const handleUpdateOrderStatus = useCallback(async (orderId: string, newStatus: "pending" | "completed" | "delivered" | "approved" | "rejected") => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      alert("No se pudo actualizar el estado del pedido.");
    }
  }, []);

  const renderMainContent = useCallback(() => {
    if (isAdmin) {
      switch (activeSection) {
        case "admin":
          return <AdminOrders orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />;
        case "mi-cuenta":
            return <MyAccount user={user} />;
        default:
          return <AdminOrders orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />;
      }
    } else if (user) {
        switch(activeSection) {
            case "mis-pedidos":
                return <MyOrders orders={orders} />
            case "mi-cuenta":
                return <MyAccount user={user} />
            case "contacto":
                return <ContactForm />
            case "viandas":
            default:
                return (
                <>
                    <WeeklyPlanner selectedDays={selectedDays} onDaySelection={handleDaySelection} onOpenCart={toggleCart} />
                    <MealGrid />
                </>
                )
        }
    } else {
        switch(activeSection) {
            case "contacto":
                return <ContactForm />
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
  }, [activeSection, user, isAdmin, orders, selectedDays, handleUpdateOrderStatus, handleDaySelection, toggleCart]);

  return (
    <div className="flex h-screen bg-background">
      <div className={`fixed inset-y-0 left-0 z-30 w-72 h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:h-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarNav
          onClose={closeSidebar}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isAdmin={isAdmin}
        />
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleSidebar} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuToggle={toggleSidebar}
          onCartToggle={activeSection === "viandas" ? toggleCart : undefined}
          selectedDaysCount={selectedDays.length}
          user={user}
          onSignOut={handleSignOut}
          onAdminLoginClick={() => setIsAdminLoginOpen(true)}
          onContactClick={handleContactClick}
        />
        <main className="flex-1 overflow-auto p-6">{renderMainContent()}</main>
        {activeSection === "viandas" && !isAdmin && (
            <div
            className={`${isCartOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out fixed right-0 top-0 z-30 h-full w-80 bg-card shadow-lg`}
            >
                <Cart
                selectedDays={selectedDays}
                onCheckout={handleCheckout}
                onCashPayment={handleCashPayment}
                onTransferPayment={handleTransferPayment}
                onClose={closeCart}
                />
            </div>
        )}
      </div>

      {isCartOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleCart} />}

      <CheckoutModal isOpen={isCheckoutOpen} onClose={handleCloseCheckout} selectedDays={selectedDays} total={total} paymentMethod={paymentMethod} user={user} />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onAdminLogin={handleAdminLogin} />
      <WhatsAppFloat />
    </div>
  )
}
