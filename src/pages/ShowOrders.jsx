import { useEffect, useState } from "react";
// 🚩 PERUBAHAN 1: Menggunakan react-router-dom sebagai pengganti next/navigation & next/link
import { useParams, useNavigate, Link } from "react-router-dom"; 
import { ArrowLeft, Receipt, User, Truck, CreditCard, Loader2, Package } from "lucide-react";
import { getOrderById } from "../services/api"; // Pastikan path ini benar mengarah ke api.js Anda


export default function ShowOrders() {
  // 🚩 PERUBAHAN 2: Menyesuaikan cara pemanggilan parameter dan navigasi
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await getOrderById(id);
        if (response.success) {
          setOrder(response.data);
        }
      } catch (error) {
        alert("Gagal memuat data pesanan.");
        // 🚩 PERUBAHAN 3: router.push diganti menjadi navigate
        navigate("/orders"); 
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrderDetail();
  }, [id, navigate]);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <Loader2 className="animate-spin text-[#D4A373]" size={48} />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF8] pt-10 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigasi Kembali (Link dari react-router-dom langsung menggunakan atribut 'to') */}
        <Link to="/orders" className="inline-flex items-center gap-2 text-[#5A665A] hover:text-[#D4A373] transition-colors mb-8 font-medium text-sm">
          <ArrowLeft size={16} /> Kembali ke Daftar Pesanan
        </Link>

        {/* HEADER INVOICE */}
        <div className="bg-white p-8 rounded-t-[2rem] border border-[#EAE6D9] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2C352D] font-playfair flex items-center gap-3">
              <Receipt className="text-[#D4A373]" size={32} /> Detail Pesanan
            </h1>
            <p className="text-[#5A665A] mt-2 font-medium">{order.invoice_no || `ORD-${order.id}`}</p>
          </div>
          <div className="px-4 py-2 bg-[#F3EFE4] text-[#3A5034] rounded-full text-sm font-bold uppercase tracking-widest border border-[#EAE6D9]">
            Status: {order.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* KOLOM KIRI: Informasi Pengguna & Pengiriman */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Box Identitas Pembeli */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#EAE6D9] shadow-sm">
              <h2 className="text-sm font-bold text-[#5A665A] uppercase tracking-widest mb-4 flex items-center gap-2">
                <User size={18} className="text-[#D4A373]" /> Identitas Pembeli
              </h2>
              <div className="space-y-3 text-sm">
                <p><span className="text-[#5A665A] block text-xs">Nama Lengkap</span> <span className="font-semibold text-[#2C352D]">{order.user?.name}</span></p>
                <p><span className="text-[#5A665A] block text-xs">Email</span> <span className="font-semibold text-[#2C352D]">{order.user?.email}</span></p>
                <p><span className="text-[#5A665A] block text-xs">Nomor Telepon</span> <span className="font-semibold text-[#2C352D]">{order.user?.phone_number || "Belum dilengkapi"}</span></p>
              </div>
            </div>

            {/* Box Informasi Ekspedisi */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#EAE6D9] shadow-sm">
              <h2 className="text-sm font-bold text-[#5A665A] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Truck size={18} className="text-[#D4A373]" /> Informasi Pengiriman
              </h2>
              <div className="space-y-3 text-sm">
                <p><span className="text-[#5A665A] block text-xs">Alamat Tujuan</span> <span className="font-semibold text-[#2C352D]">{order.address || order.user?.address || "Menunggu alamat"}</span></p>
                <p><span className="text-[#5A665A] block text-xs">Kurir & Layanan</span> <span className="font-semibold uppercase text-[#2C352D]">{order.courier_company || "Menunggu Sistem"} - {order.courier_type || "Reguler"}</span></p>
                <p><span className="text-[#5A665A] block text-xs">Nomor Resi</span> <span className="font-semibold text-[#3A5034] tracking-wider bg-[#F3EFE4] px-2 py-1 rounded">{order.waybill_id || "Belum diterbitkan"}</span></p>
              </div>
            </div>

            {/* Box Pembayaran */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#EAE6D9] shadow-sm">
              <h2 className="text-sm font-bold text-[#5A665A] uppercase tracking-widest mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#D4A373]" /> Pembayaran
              </h2>
              <div className="space-y-3 text-sm">
                <p><span className="text-[#5A665A] block text-xs">Metode</span> <span className="font-semibold text-[#2C352D] uppercase">{order.payment_method}</span></p>
                {order.payment_url && (
                  <a href={order.payment_url} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold text-white bg-[#D4A373] px-3 py-1.5 rounded-lg hover:bg-[#b0865c]">
                    Buka Halaman Pembayaran
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Daftar Barang */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#EAE6D9] shadow-sm">
              <h2 className="text-lg font-bold text-[#2C352D] font-playfair mb-6 flex items-center gap-2 border-b border-[#EAE6D9] pb-4">
                <Package size={22} className="text-[#D4A373]" /> Rincian Barang
              </h2>
              
              <div className="space-y-4 mb-8">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 bg-[#FDFCF8] p-4 rounded-2xl border border-[#EAE6D9]/50">
                    <div>
                      <p className="font-semibold text-[#2C352D]">{item.product?.name || "Produk Tidak Dikenal"}</p>
                      <p className="text-sm text-[#5A665A]">{item.quantity} x {formatIDR(item.price)}</p>
                    </div>
                    <p className="font-bold text-[#3A5034]">{formatIDR(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Kalkulasi Total */}
              <div className="border-t border-[#EAE6D9] pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-[#5A665A]">
                  <span>Subtotal Produk</span>
                  <span className="font-medium text-[#2C352D]">{formatIDR(order.total_price - (order.shipping_cost || 0))}</span>
                </div>
                <div className="flex justify-between text-[#5A665A]">
                  <span>Ongkos Kirim</span>
                  <span className="font-medium text-[#2C352D]">{formatIDR(order.shipping_cost || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#EAE6D9] mt-4">
                  <span className="text-sm font-bold text-[#5A665A] uppercase tracking-widest">Total Akhir</span>
                  <span className="text-3xl font-bold text-[#3A5034] tracking-tight">{formatIDR(order.total_price)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}