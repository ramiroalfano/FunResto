import { ref, push, set, onValue, update, get, DataSnapshot } from "firebase/database";
import { db, auth } from "./firebaseConfig";

export type Order = {
  items: any[];
  total: number;
  userId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

/**
 * Crea un nuevo pedido en Realtime Database y devuelve el id generado.
 */
export async function createOrder(order: Order): Promise<string> {
  const ordersRef = ref(db, "orders");
  const newRef = push(ordersRef);
  const payload = {
    ...order,
    status: order.status || "pendiente",
    createdAt: new Date().toISOString(),
  };
  await set(newRef, payload);
  return newRef.key as string;
}

/**
 * Escucha cambios en la colección `orders` y llama callback con un array de pedidos.
 * Devuelve la función unsubscribe.
 */
export function listenOrders(
  callback: (orders: Array<Order & { id: string }>) => void
): () => void {
  const ordersRef = ref(db, "orders");
  const unsubscribe = onValue(ordersRef, (snapshot: DataSnapshot) => {
    const val = snapshot.val();
    if (!val) return callback([]);
    // val tiene la forma { id1: {...}, id2: {...} }
    const orders = Object.keys(val).map((key) => ({ id: key, ...val[key] }));
    // ordenar por createdAt descendente si existe
    orders.sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
      return tb - ta;
    });
    callback(orders);
  });
  return unsubscribe;
}

/**
 * Actualiza campos de un pedido por id.
 */
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  const orderRef = ref(db, `orders/${orderId}`);
  await update(orderRef, { ...updates, updatedAt: new Date().toISOString() } as any);
}

/**
 * Obtiene un pedido por id.
 */
export async function getOrderById(orderId: string): Promise<(Order & { id: string }) | null> {
  const snap = await get(ref(db, `orders/${orderId}`));
  if (!snap.exists()) return null;
  return { id: snap.key as string, ...(snap.val() as Order) };
}

/**
 * Comprueba si el usuario actual tiene el claim `admin`.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  const token = await user.getIdTokenResult(true);
  return !!(token.claims as any)?.admin;
}

export default {
  createOrder,
  listenOrders,
  updateOrder,
  getOrderById,
  isCurrentUserAdmin,
};
