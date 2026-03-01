import { useState } from "react";
import { loginAdmin } from "../services/api";

export default function Login() {
  // STATE (nyimpen input user)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // HANDLE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginAdmin({
        email: email,
        password: password,
      });

      console.log("Response API:", result);

      if (result.success) {
        // simpan user ke browser
        localStorage.setItem("okai_admin", JSON.stringify(result.user));

        // pindah ke dashboard
        window.location.href = "/dashboard";
      } else {
        alert("❌ Login gagal!");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // UI LOGIN PAGE
  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h2>OKAI Admin Login</h2>

        <input
          type="email"
          placeholder="Email Admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

//simple style biar rapih dlu
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    background: "#111827",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
