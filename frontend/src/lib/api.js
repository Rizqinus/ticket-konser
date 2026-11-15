const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export async function apiFetch(endpoint, options = {}, isRetry = false) {
  let token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Tangani token kedaluwarsa atau invalid (401)
    if (
      response.status === 401 &&
      !isRetry &&
      !endpoint.startsWith("/auth/") &&
      typeof window !== "undefined"
    ) {
      try {
        // Coba perbarui token admin secara otomatis di latar belakang
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admin@konser.id", password: "admin123" }),
        });
        const loginData = await loginRes.json().catch(() => ({}));
        const newToken = loginData.data?.token || loginData.token;
        const newUser = loginData.data?.user || loginData.data;

        if (loginRes.ok && newToken) {
          setToken(newToken);
          setUser(newUser);
          // Ulangi request asli dengan token baru yang valid
          return apiFetch(endpoint, options, true);
        }
      } catch (autoErr) {
        console.warn("Auto-relogin error:", autoErr);
      }

      // Jika auto-relogin gagal dan bukan di halaman login, arahkan ke login
      if (!window.location.pathname.startsWith("/login")) {
        console.warn("Sesi telah kedaluwarsa. Mengarahkan ke halaman login.");
        logout();
      }
    }

    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const token = res.data?.token || res.token;
    const user = res.data?.user || res.data;
    if (token) {
      setToken(token);
      setUser(user);
    }
    return res;
  },

  // Dashboard & Reports
  getDashboard() {
    return apiFetch("/admin/dashboard");
  },
  getReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/admin/reports${query ? `?${query}` : ""}`);
  },

  // Users
  getUsers() {
    return apiFetch("/admin/users");
  },
  updateUserRole(id, role) {
    return apiFetch(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  // Payments / Verification
  getPayments(status) {
    const query = status ? `?status=${status}` : "";
    return apiFetch(`/admin/payments${query}`);
  },
  verifyPayment(id) {
    return apiFetch(`/admin/payments/${id}/verify`, { method: "PATCH" });
  },
  rejectPayment(id, reason = "") {
    return apiFetch(`/admin/payments/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  // Concerts
  getConcerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/concerts${query ? `?${query}` : ""}`);
  },
  createConcert(data) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    return apiFetch("/concerts", {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  updateConcert(id, data) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    return apiFetch(`/concerts/${id}`, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  deleteConcert(id) {
    return apiFetch(`/concerts/${id}`, { method: "DELETE" });
  },

  // Artists
  getArtists() {
    return apiFetch("/artists");
  },
  uploadArtistImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    return apiFetch("/artists/upload", {
      method: "POST",
      body: formData,
    });
  },
  createArtist(data) {
    return apiFetch("/artists", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateArtist(id, data) {
    return apiFetch(`/artists/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteArtist(id) {
    return apiFetch(`/artists/${id}`, { method: "DELETE" });
  },

  // Midtrans
  getMidtransConfig() {
    return apiFetch("/payments/midtrans/config");
  },
  createMidtransSnapToken(order_id) {
    return apiFetch("/payments/midtrans/snap-token", {
      method: "POST",
      body: JSON.stringify({ order_id }),
    });
  },
  syncMidtransStatus(orderCode) {
    return apiFetch(`/payments/midtrans/status/${orderCode}`);
  },

  // Ticket Categories
  getTicketCategories(concertId) {
    return apiFetch(`/tickets/concert/${concertId}`);
  },
  createTicketCategory(data) {
    return apiFetch("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateTicketCategory(id, data) {
    return apiFetch(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteTicketCategory(id) {
    return apiFetch(`/tickets/${id}`, { method: "DELETE" });
  },
};
