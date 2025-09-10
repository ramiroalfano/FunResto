import { db, auth } from "./firebaseConfig";
import { ref, set, get, onValue, off, remove } from "firebase/database";

// Interfaz para el tipo de Pedido
export interface Order {
  id: string; 
  userId: string;
  items: { title: string; price: number; quantity: number }[];
  total: number;
  childName: string;
  course: string;
  selectedDays: string[];
  date: string;
  status: "pending" | "completed" | "delivered" | "approved" | "rejected" | "not_delivered";
  paymentMethod: "mercadopago" | "cash" | "transfer";
  paymentStatus: "pagado" | "pendiente";
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  transferImage?: string;
}

export const createOrder = (order: Omit<Order, 'id'>) => {
  const orderRef = ref(db, 'orders/' + new Date().getTime());
  return set(orderRef, order);
};

export const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
  const orderStatusRef = ref(db, `orders/${orderId}/status`);
  return set(orderStatusRef, newStatus);
};

export const deleteOrder = (orderId: string) => {
  const orderRef = ref(db, `orders/${orderId}`);
  return remove(orderRef);
};


export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const idTokenResult = await user.getIdTokenResult(true);
    return idTokenResult.claims.admin === true;
  } catch (error) {
    console.error("Error fetching user token:", error);
    return false;
  }
};

export const listenOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = ref(db, 'orders');
  const listener = onValue(ordersRef, (snapshot) => {
    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      const ordersList = Object.keys(ordersData)
        .map(key => ({ ...ordersData[key], id: key }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordenar por fecha descendente
      callback(ordersList);
    } else {
      callback([]);
    }
  });
  return () => off(ordersRef, 'value', listener);
};

export const listenUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const ordersRef = ref(db, 'orders');
  const listener = onValue(ordersRef, (snapshot) => {
    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      const userOrders = Object.keys(ordersData)
        .map(key => ({ ...ordersData[key], id: key }))
        .filter(order => order.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordenar por fecha descendente
      callback(userOrders);
    } else {
      callback([]);
    }
  });
  return () => off(ordersRef, 'value', listener);
};