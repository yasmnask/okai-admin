const API_URL = "http://localhost/okai-api";

export async function loginAdmin(data) {
  const response = await fetch(`${API_URL}/auth/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
