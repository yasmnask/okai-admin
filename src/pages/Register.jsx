import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdmin, getGoogleLoginUrl } from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("affiliate"); // Default ke affiliate
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("❌ Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    setIsLoading(true);

    try {
      const result = await registerAdmin({ 
        name, 
        email, 
        role, 
        password, 
        password_confirmation: confirmPassword 
      });

      if (result.success) {
        alert(`✅ Registrasi sebagai ${role.toUpperCase()} berhasil! Silakan periksa email Anda.`);
        navigate("/login");
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
    <div className="min-h-screen flex items-center justify-center bg-[#fff2ea] font-poppins px-4 py-10">
      <div
        className="w-full max-w-[400px] h-fit max-h-[90vh] rounded-3xl px-16 py-12 shadow-lg overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20"
        style={{
          background: "linear-gradient(135deg, #ed823f 0%, #990032 100%)",
        }}
      >
        <h1 className="text-4xl font-bold text-white text-center mt-8 mb-1.5">
          Create Account
        </h1>

        <p className="text-center text-[12px] text-white/90 mb-6 font-poppins">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold underline hover:text-[#ffd6bf]"
          >
            Login here
          </Link>
        </p>

        <form onSubmit={handleRegister}>
          {/* NAME */}
          <div className="mb-3">
            <label className="block text-white text-sm font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1.5 px-4 rounded bg-[#fef5f0] outline-none border-none"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="block text-white text-sm font-semibold mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1.5 px-4 rounded bg-[#fef5f0] outline-none border-none"
            />
          </div>

          {/* ROLE SELECT */}
          <div className="mb-3">
            <label className="block text-white text-sm font-semibold mb-1">
              Register As
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-[13px] text-gray-700 py-1.5 px-4 rounded bg-[#fef5f0] outline-none border-none font-bold cursor-pointer appearance-none"
            >
              <option value="affiliate">Partner Affiliate</option>
              <option value="admin">Admin Operasional</option>
            </select>
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="block text-white text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1.5 px-4 rounded bg-[#fef5f0] outline-none border-none"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3">
            <label className="block text-white text-sm font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full text-[13px] text-gray-700 py-1.5 px-4 rounded bg-[#fef5f0] outline-none border-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 mt-6 text-[#fff2ea] text-[15px] font-semibold rounded bg-[#ff8c42] hover:bg-[#e46516] transition-colors duration-300"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {/* GOOGLE BUTTON */}
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