import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Inicialización de la app de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Interfaz para el tipo de Pedido
export interface Order {
  userId: string;
  items: { title: string; price: number; quantity: number }[];
  total: number;
  childName: string;
  course: string;
  selectedDays: string[];
  date: string;
  status: "pending" | "completed" | "delivered" | "approved" | "rejected";
  paymentMethod: "mercadopago" | "cash" | "transfer";
  paymentStatus: "pagado" | "pendiente";
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  transferImage?: string;
}

/**
 * Guarda un nuevo pedido en la base de datos.
 * @param order El objeto de pedido a guardar.
 */
export const createOrder = (order: Omit<Order, 'id'>) => {
  const orderRef = ref(db, 'orders/' + new Date().getTime()); // Usar timestamp como ID simple
  return set(orderRef, order);
};

/**
 * Actualiza el estado de un pedido específico en la base de datos.
 * @param orderId El ID del pedido a actualizar.
 * @param newStatus El nuevo estado del pedido.
 */
export const updateOrderStatus = (orderId: string, newStatus: "pending" | "completed" | "delivered" | "approved" | "rejected") => {
  const orderStatusRef = ref(db, `orders/${orderId}/status`);
  return set(orderStatusRef, newStatus);
};

/**
 * Verifica si el usuario actual es un administrador.
 * Esto se hace verificando los custom claims en el token de autenticación del usuario.
 * @returns true si el usuario es admin, false en caso contrario.
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) {
    return false;
  }
  try {
    const idTokenResult = await user.getIdTokenResult(true); // Forzar la actualización del token
    return idTokenResult.claims.admin === true;
  } catch (error) {
    console.error("Error al obtener el token del usuario:", error);
    return false;
  }
};

/**
 * Escucha los cambios en todos los pedidos (para administradores).
 * @param callback La función que se ejecutará cada vez que los pedidos cambien.
 * @returns Una función para desuscribirse del listener.
 */
export const listenOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = ref(db, 'orders');
  const listener = onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    const ordersList = data ? Object.keys(data).map(key => ({ ...data[key], id: key })).reverse() : [];
    callback(ordersList);
  });
  return listener; // Devuelve la función de cancelación de la suscripción
};

/**
 * Escucha los cambios en los pedidos de un usuario específico.
 * @param userId El UID del usuario.
 * @param callback La función que se ejecutará cada vez que los pedidos del usuario cambien.
 * @returns Una función para desuscribirse del listener.
 */
export const listenUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const ordersRef = ref(db, 'orders');
  const listener = onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    const userOrders = data ? Object.keys(data)
      .map(key => ({ ...data[key], id: key }))
      .filter(order => order.userId === userId)
      .reverse()
      : [];
    callback(userOrders);
  });
  return listener;
};
