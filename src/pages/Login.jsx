import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, getGoogleLoginUrl } from "../services/api"; // Hanya memanggil jalur reguler

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mengirim email dan kata sandi ke backend Laravel
      const result = await loginAdmin({ email, password });

      if (result && result.success) {
        // Menyimpan data identitas ke dalam penyimpanan peramban (browser)
        localStorage.setItem("okai_admin", JSON.stringify(result.user));

        // 🚩 PERUBAHAN: Cek role user, lalu arahkan ke halaman yang sesuai
        const userRole = result.user.role?.toLowerCase();

        if (userRole === "affiliate") {
          navigate("/affiliate"); // Affiliate dilempar ke dashboard mitranya
        } else {
          navigate("/dashboard"); // Super Admin & Admin tetap ke dashboard utama
        }
      } else {
        alert(
          "❌ Login gagal! Silakan periksa kembali email dan password Anda.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi masalah koneksi dengan server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 1. Minta URL otentikasi Google dari backend Laravel
      const result = await getGoogleLoginUrl();

      // 2. Jika berhasil mendapatkan URL, alihkan browser ke halaman Google
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Gagal mendapatkan tautan login Google.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Terjadi masalah saat menghubungi server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff2ea] font-poppins">
      <div
        className="w-[400px] h-[500px] rounded-3xl px-16 py-12 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #ed823f 0%, #990032 100%)",
        }}
      >
        <h1 className="text-4xl font-bold text-white text-center mt-8 mb-1.5">
          Welcome back{" "}
        </h1>

        <form onSubmit={handleLogin}>
          <div>
            <label className="block text-white text-sm font-semibold mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1 px-4 rounded bg-[#fef5f0]"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mt-2 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1 px-4 rounded bg-[#fef5f0]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 mt-8 text-[#fff2ea] text-[15px] font-semibold rounded bg-[#ff8c42] hover:bg-[#e46516] transition-colors duration-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 mt-3 text-[#e46516] text-[15px] font-semibold rounded bg-[#fff2ea] hover:bg-[#e1d4cc] transition-colors duration-300"
          >
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
}
