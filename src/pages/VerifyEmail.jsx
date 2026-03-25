import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyUserEmail } from "../services/api";

export default function VerifyEmailPage() {
  const { id, hash } = useParams(); // Mengambil ID dan Hash dari URL
  const [searchParams] = useSearchParams(); // Mengambil ?expires=...&signature=...
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Sedang memverifikasi email Anda...");
  
  // useRef digunakan agar verifikasi tidak berjalan 2x secara tidak sengaja di React Strict Mode
  const hasVerified = useRef(false); 

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        const queryParams = searchParams.toString();
        const result = await verifyUserEmail(id, hash, queryParams);

        if (result.success) {
          setStatus("success");
          setMessage("Email berhasil diverifikasi! Akun Anda kini sudah aktif.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.message);
      }
    };

    if (id && hash) {
      verify();
    } else {
      setStatus("error");
      setMessage("Tautan verifikasi tidak lengkap.");
    }
  }, [id, hash, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff2ea] font-poppins">
      <div
        className="w-[400px] h-[500px] rounded-3xl px-12 py-12 shadow-lg flex flex-col items-center justify-center text-center"
        style={{
          background: "linear-gradient(135deg, #ed823f 0%, #990032 100%)",
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          Email Verification
        </h1>

        {/* Indikator Status Visual */}
        <div className="bg-[#fef5f0] p-6 rounded-2xl w-full shadow-inner mb-8">
          {status === "loading" && (
            <div className="text-[#e46516] font-semibold animate-pulse">
              ⏳ Memproses verifikasi...
            </div>
          )}
          
          {status === "success" && (
            <div className="text-green-600 font-semibold">
              ✅ {message}
            </div>
          )}

          {status === "error" && (
            <div className="text-red-600 font-semibold">
              ❌ {message}
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        {status === "success" ? (
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 text-[#e46516] text-[15px] font-bold rounded bg-[#fff2ea] hover:bg-[#e1d4cc] transition-colors duration-300"
          >
            Go to Login
          </button>
        ) : status === "error" ? (
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3 px-4 text-white text-[15px] font-bold rounded bg-red-600 hover:bg-red-700 transition-colors duration-300"
          >
            Back to Register
          </button>
        ) : null}

        <p className="mt-6 text-[12px] text-white/80">
          Need help? <Link to="/contact" className="underline hover:text-white">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}