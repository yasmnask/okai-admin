import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdmin, getGoogleLoginUrl } from "../services/api"; // 

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    setIsLoading(true);

    try {
      // 4. Kirim data ke API (Kunci: password_confirmation)
      const result = await registerAdmin({ 
        name, 
        email, 
        password, 
        password_confirmation: confirmPassword 
      });

      if (result.success) {
        alert("✅ Registrasi berhasil! Silakan periksa kotak masuk email Anda.");
        navigate("/login"); // 5. Arahkan ke halaman login
      }
    } catch (error) {
      console.error("Register error:", error);
      alert(`❌ Registrasi gagal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      // Menggunakan URL yang sama persis dengan Login
      const result = await getGoogleLoginUrl();
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Gagal mendapatkan tautan registrasi Google.");
      }
    } catch (error) {
      console.error("Google register error:", error);
      alert("Terjadi masalah saat menghubungi server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff2ea] font-poppins">
      <div
        className="w-[400px] h-[500px] rounded-3xl px-16 py-12 shadow-lg overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/30"
        style={{
          background: "linear-gradient(135deg, #ed823f 0%, #990032 100%)",
        }}
      >
        <h1 className="text-4xl font-bold text-white text-center mt-8 mb-1.5">
          Create Account
        </h1>

        <p className="text-center text-[12px] text-white/90 mb-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold underline hover:text-[#ffd6bf]"
          >
            Login here
          </Link>
        </p>

        <form onSubmit={handleRegister}>
          <div>
            <label className="block text-white text-sm font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1 px-4 rounded bg-[#fef5f0]"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mt-2 mb-1">
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

          <div>
            <label className="block text-white text-sm font-semibold mt-2 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1 px-4 rounded bg-[#fef5f0]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 mt-8 text-[#fff2ea] text-[15px] font-semibold rounded bg-[#ff8c42] hover:bg-[#e46516] transition-colors duration-300"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full py-2 px-4 mt-3 text-[#e46516] text-[15px] font-semibold rounded bg-[#fff2ea] hover:bg-[#e1d4cc] transition-colors duration-300"
          >
            Register with Google
          </button>
        </form>
      </div>
    </div>
  );
}
