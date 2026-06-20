const API_URL = "http://localhost:8000/api";

// ==========================================
// HELPER: OTOMATISASI HEADERS & TOKEN
// ==========================================
function getAuthHeaders(isFormData = false) {
  const adminData = JSON.parse(localStorage.getItem("okai_admin") || "{}");
  const token = adminData?.token; // Pastikan backend-mu mengirimkan properti 'token' saat login

  const headers = {
    "Accept": "application/json",
  };

  // Jika token ada, selipkan ke header Authorization
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Jika BUKAN FormData (berarti JSON biasa), tambahkan Content-Type
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// ==========================================
// 1. OTENTIKASI & KEAMANAN
// ==========================================

export async function loginAdmin(data) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" }, // Login belum butuh token
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function logoutAdmin() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
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

export async function getProducts(searchQuery = '') {
  const url = searchQuery ? `${API_URL}/products?search=${encodeURIComponent(searchQuery)}` : `${API_URL}/products`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat data produk dari server.");
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat detail produk.");
  return response.json();
}

export async function addProduct(data) {
  const isFormData = data instanceof FormData;

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data), 
  });
  
  return response.json();
}

export async function updateProduct(id, data) {
  // PENTING: updateProduct menerima parameter data yang BUKAN instance FormData asli di EditProduct 
  // (kamu mengirim payload = new FormData() di komponennya). 
  // Kita pastikan header Content-Type dihilangkan jika itu FormData.
  const isFormData = data instanceof FormData;

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "POST", // Trik Laravel untuk baca file saat PUT
    headers: getAuthHeaders(isFormData),
    body: data, 
  });
  
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
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

export async function getUsers(searchQuery = '') {
  const url = searchQuery ? `${API_URL}/users?search=${encodeURIComponent(searchQuery)}` : `${API_URL}/users`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat data pengguna dari server.");
  return response.json();
}

export async function getUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat detail pengguna.");
  return response.json();
}

export async function addUser(data) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateUser(id, data) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat data promosi.");
  return response.json();
}

export async function getPromotionById(id) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat detail promosi.");
  return response.json();
}

export async function addPromotion(data) {
  const response = await fetch(`${API_URL}/promotions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updatePromotion(id, data) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deletePromotion(id) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus promosi.");
  return response.json();
}

export const getActiveShipments = async () => {
  const response = await fetch(`${API_URL}/active-shipments`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

// ==========================================
// 5. MANAJEMEN PESANAN (ORDERS)
// ==========================================

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat data pesanan.");
  return response.json();
}

// Fungsi Lacak Resi via Laravel
export async function trackResi(awb, courier) {
  const response = await fetch(`${API_URL}/track?awb=${awb}&courier=${courier}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal melacak resi dari server.");
  return response.json();
}

// Anda tidak perlu lagi melakukan import axios atau axiosInstance

export const getOrderById = async (orderId) => {
  try {
    // 1. Ambil token dari brankas lokal
    const token = localStorage.getItem("token"); // Sesuaikan jika namanya "kambi_token"

    // 2. Gunakan fetch bawaan browser
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Menempelkan token ke setiap permintaan
        "Authorization": token ? `Bearer ${token}` : "", 
      },
    });

    // 3. Pengecekan manual apakah server menolak (misal: 401 atau 404)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 4. Ubah format teks menjadi objek JavaScript
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Gagal mengambil detail pesanan:", error);
    throw error;
  }
};

export const markOrderAsPaid = async (id) => {
  const response = await fetch(`${API_URL}/orders/${id}/mark-paid`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const shipWithBiteship = async (id, data) => {
  const response = await fetch(`${API_URL}/orders/${id}/ship`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const shipManual = async (id, data) => {
  const response = await fetch(`${API_URL}/orders/${id}/ship-manual`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const simulateDelivery = async (id) => {
  const response = await fetch(`${API_URL}/orders/${id}/simulate-delivery`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return response.json();
};

// ==========================================
// 6. MANAJEMEN AFFILIATE (AFFILIATE)
// ==========================================

export const getAffiliateStats = async () => {
  const response = await fetch(`${API_URL}/affiliate/stats`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const getWithdrawals = async () => {
  const response = await fetch(`${API_URL}/affiliate/withdrawals`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const updateWithdrawalStatus = async (id, status, adminNote = "") => {
  const response = await fetch(`${API_URL}/affiliate/withdrawals/${id}/status`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, admin_note: adminNote }),
  });
  return response.json();
};

export const markWithdrawalAsPaid = async (id) => {
  const response = await fetch(`${API_URL}/affiliate/withdrawals/${id}/pay`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const getAffiliateList = async () => {
  const response = await fetch(`${API_URL}/affiliate/list`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export async function updateAffiliateStatus(id, newStatus) {
  const response = await fetch(`${API_URL}/affiliates/${id}/status`, {
    method: "PATCH", // 🚩 Kembalikan ke PATCH sesuai permintaan server
    headers: {
      ...getAuthHeaders(), // Mengambil Token ID Card otomatis
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Gagal mengupdate status mitra.");
  }
  return response.json();
}

// Fungsi untuk mengambil detail data affiliator berdasarkan ID
export async function getAffiliateById(id) {
  const response = await fetch(`${API_URL}/affiliates/${id}`, {
    method: "GET",
    headers: getAuthHeaders(), // Mengasumsikan Anda memiliki fungsi untuk menyertakan token
  });
  
  if (!response.ok) throw new Error("Gagal mengambil detail data mitra.");
  return response.json();
}

// ==========================================
// API WAREHOUSES
// ==========================================
export const getWarehouses = async () => {
  const response = await fetch(`${API_URL}/warehouses`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const getWarehouseById = async (id) => {
  const response = await fetch(`${API_URL}/warehouses/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const addWarehouse = async (data) => {
  const response = await fetch(`${API_URL}/warehouses`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateWarehouse = async (id, data) => {
  const response = await fetch(`${API_URL}/warehouses/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteWarehouse = async (id) => {
  const response = await fetch(`${API_URL}/warehouses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const updateProductStock = async (warehouseId, data) => {
  const response = await fetch(`${API_URL}/warehouses/${warehouseId}/products`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// ==========================================
// 7. MANAJEMEN ULASAN (REVIEWS)
// ==========================================

export async function getProductReviews(productId) {
  const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat ulasan produk.");
  return response.json();
}

export async function replyToReview(reviewId, adminReplyText) {
  const response = await fetch(`${API_URL}/reviews/${reviewId}/reply`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ admin_reply: adminReplyText }),
  });
  if (!response.ok) throw new Error("Gagal mengirim balasan.");
  return response.json();
}

// ==========================================
// 8. PENGATURAN SISTEM (SYSTEM SETTINGS)
// ==========================================

export async function getSystemSettings() {
  const response = await fetch(`${API_URL}/system-settings`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat pengaturan sistem.");
  return response.json();
}

export async function updateSystemSettings(data) {
  const response = await fetch(`${API_URL}/system-settings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Gagal menyimpan pengaturan sistem.");
  return response.json();
}

// ==========================================
// 9. BUSINESS ANALYTICS
// ==========================================
export const getAnalyticsDashboard = async (days = '') => {
  const url = days ? `${API_URL}/analytics/dashboard?days=${days}` : `${API_URL}/analytics/dashboard`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat data Analytics.");
  return response.json();
};

export const getDashboardSummary = async () => {
  const response = await fetch(`${API_URL}/dashboard/summary`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat data Dashboard.");
  return response.json();
};
