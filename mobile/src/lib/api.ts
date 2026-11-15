import { Platform } from "react-native";

export const getApiBase = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }
  return "http://127.0.0.1:5000/api";
};

export const API_BASE = getApiBase();

let cachedToken: string | null = null;
let cachedUser: any = null;

// Simple web/memory storage
export function setAuth(token: string | null, user: any = null) {
  cachedToken = token;
  cachedUser = user;
  if (Platform.OS === "web" && typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("user_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));
    } else {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_data");
    }
  }
}

export function getAuth() {
  if (!cachedToken && Platform.OS === "web" && typeof window !== "undefined") {
    cachedToken = localStorage.getItem("user_token");
    try {
      const u = localStorage.getItem("user_data");
      cachedUser = u ? JSON.parse(u) : null;
    } catch {
      cachedUser = null;
    }
  }
  return { token: cachedToken, user: cachedUser };
}

export function logout() {
  setAuth(null, null);
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data: T }> {
  const { token } = getAuth();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const primaryBase = getApiBase();
  let res: Response;

  try {
    res = await fetch(`${primaryBase}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    // Jika fetch gagal (misal resolusi IPv6 localhost di Chrome), fallback otomatis ke 127.0.0.1
    if (primaryBase.includes("localhost")) {
      const fallbackBase = primaryBase.replace("localhost", "127.0.0.1");
      res = await fetch(`${fallbackBase}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      throw err;
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async ensureAuth() {
    const { token } = getAuth();
    if (token) return token;
    try {
      const res = await api.login("user@konser.id", "user123");
      return res.data?.token || (res as any).token;
    } catch (e) {
      console.warn("Auto-login fallback error:", e);
      return null;
    }
  },

  async login(email: string, password: string) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const token = res.data?.token || (res as any).token;
    const user = res.data?.user || res.data;
    if (token) {
      setAuth(token, user);
    }
    return res;
  },

  async register(name: string, email: string, password: string, phone = "") {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
  },

  // Concerts
  getConcerts(search = "", status = "upcoming") {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    const query = params.toString();
    return apiFetch(`/concerts${query ? `?${query}` : ""}`);
  },

  getConcertById(id: string | number) {
    return apiFetch(`/concerts/${id}`);
  },

  getConcertArtists(concertId: string | number) {
    return apiFetch(`/concerts/${concertId}/artists`);
  },

  // Tickets
  getTicketCategories(concertId: string | number) {
    return apiFetch(`/tickets/concert/${concertId}`);
  },

  getMyTickets() {
    return apiFetch("/tickets/my-tickets");
  },

  // Orders
  createOrder(
    items: { ticket_category_id: number; quantity: number }[],
    payment_method?: string
  ) {
    return apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ items, payment_method }),
    });
  },

  getMyOrders() {
    return apiFetch("/orders/my-orders");
  },

  getOrderById(id: string | number) {
    return apiFetch(`/orders/${id}`);
  },

  // Payments
  createPayment(order_id: number, payment_method: string) {
    return apiFetch("/payments", {
      method: "POST",
      body: JSON.stringify({ order_id, payment_method }),
    });
  },

  createMidtransSnapToken(order_id: number) {
    return apiFetch("/payments/midtrans/snap-token", {
      method: "POST",
      body: JSON.stringify({ order_id }),
    });
  },

  getMidtransConfig() {
    return apiFetch("/payments/midtrans/config");
  },

  syncMidtransStatus(order_code: string) {
    return apiFetch(`/payments/midtrans/status/${order_code}`);
  },

  paySuccess(payment_id: number) {
    return apiFetch(`/payments/${payment_id}/success`, {
      method: "PATCH",
    });
  },

  uploadPaymentProof(payment_id: number, formData: FormData) {
    return apiFetch(`/payments/${payment_id}/proof`, {
      method: "POST",
      body: formData,
    });
  },

  // Favorites
  getFavorites() {
    return apiFetch("/favorites");
  },

  addFavorite(concertId: number | string) {
    return apiFetch(`/favorites/${concertId}`, { method: "POST" });
  },

  removeFavorite(concertId: number | string) {
    return apiFetch(`/favorites/${concertId}`, { method: "DELETE" });
  },

  // Notifications
  getNotifications() {
    return apiFetch("/notifications");
  },
};
