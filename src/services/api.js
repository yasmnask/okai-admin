const API_URL = "http://localhost:8000/api";

// ==========================================
// 1. OTENTIKASI & KEAMANAN
// ==========================================

export async function loginAdmin(data) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function logoutAdmin() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" }
  });
  return response.json();
}

export async function registerAdmin(data) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal melakukan registrasi");
  }
  return response.json();
}

export async function verifyUserEmail(id, hash, queryParams) {
  const response = await fetch(`${API_URL}/verify-email/${id}/${hash}?${queryParams}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) {
    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (isJson) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tautan verifikasi tidak valid atau kedaluwarsa.");
    } else {
      throw new Error("Terjadi kesalahan di server Laravel.");
    }
  }
  return response.json();
}

export async function getGoogleLoginUrl() {
  const response = await fetch(`${API_URL}/auth/google/url`, {
    method: "GET",
    headers: { "Accept": "application/json" }
  });
  return response.json();
}

// ==========================================
// 2. MANAJEMEN PRODUK (PRODUCT)
// ==========================================

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal memuat data produk dari server.");
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal memuat detail produk.");
  return response.json();
}

export async function addProduct(data) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateProduct(id, data) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menghapus produk.");
  }
  return response.json();
}

// ==========================================
// 3. MANAJEMEN PENGGUNA (USER)
// ==========================================

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal memuat data pengguna dari server.");
  return response.json();
}

export async function getUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal memuat detail pengguna.");
  return response.json();
}

export async function addUser(data) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateUser(id, data) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menghapus pengguna.");
  }
  return response.json();
}

// ==========================================
// 4. MANAJEMEN PROMOSI (PROMOTIONS)
// ==========================================

export async function getPromotions() {
  const response = await fetch(`${API_URL}/promotions`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal memuat data promosi.");
  return response.json();
}

export async function getPromotionById(id) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal memuat detail promosi.");
  return response.json();
}

export async function addPromotion(data) {
  const response = await fetch(`${API_URL}/promotions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updatePromotion(id, data) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deletePromotion(id) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal menghapus promosi.");
  return response.json();
}

export const getAffiliateStats = async () => {
  const response = await fetch(`${API_URL}/affiliate/stats`);
  return response.json();
};

export const getWithdrawals = async () => {
  const response = await fetch(`${API_URL}/affiliate/withdrawals`);
  return response.json();
};

export const updateWithdrawalStatus = async (id, status, adminNote = "") => {
  const response = await fetch(`${API_URL}/affiliate/withdrawals/${id}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, admin_note: adminNote }),
  });
  return response.json();
};

export const getAffiliateList = async () => {
  const response = await fetch(`${API_URL}/affiliate/list`);
  return response.json();
};