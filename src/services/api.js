const API_URL = "http://localhost:8000/api";

export async function loginAdmin(data) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function logoutAdmin() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return response.json();
}

export async function registerAdmin(data) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json", // Penting agar Laravel membalas dengan JSON, bukan redirect HTML
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal melakukan registrasi");
  }

  return response.json();
}

export async function verifyUserEmail(id, hash, queryParams) {
  // Menggabungkan ID, Hash, dan parameter keamanan (signature & expires)
  const response = await fetch(`${API_URL}/verify-email/${id}/${hash}?${queryParams}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    // Mengecek apakah Laravel membalas dengan JSON atau HTML (Error Server)
    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (isJson) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tautan verifikasi tidak valid atau sudah kedaluwarsa.");
    } else {
      throw new Error("Terjadi kesalahan di server Laravel. Silakan cek terminal backend.");
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

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal memuat data produk dari server.");
  }

  return response.json();
}

// Tambahkan fungsi-fungsi ini di api.js
export async function addProduct(data) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateProduct(id, data) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT", // Atau PATCH tergantung backend Naufal
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" }
  });
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data detail produk.");
  }

  return response.json();
}

export async function getPromotionById(id) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "GET",
    headers: { "Accept": "application/json" }
  });
  return response.json();
}

export async function updatePromotion(id, data) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}