import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
// 🚩 PERUBAHAN 1: Menggunakan react-router-dom sebagai pengganti next/navigation & next/link
import { useParams, useNavigate, Link } from "react-router-dom"; 
import { ArrowLeft, Receipt, User, Truck, CreditCard, Loader2, Package, CheckCircle, RefreshCw } from "lucide-react";
import { getOrderById, markOrderAsPaid, shipWithBiteship, simulateDelivery, shipManual } from "../services/api"; 


export default function ShowOrders() {
  // 🚩 PERUBAHAN 2: Menyesuaikan cara pemanggilan parameter dan navigasi
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState("jne");
  const [selectedCourierType, setSelectedCourierType] = useState("reg");
  const [shippingMode, setShippingMode] = useState("biteship");
  const [manualAwb, setManualAwb] = useState("");

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderById(id);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      toast.error("Gagal memuat data pesanan.");
      navigate("/orders"); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetail();
  }, [id, navigate]);

  const handleMarkAsPaid = async () => {
    if (!window.confirm("Tandai pesanan ini sebagai Lunas (Paid)?")) return;
    setIsProcessing(true);
    try {
      await markOrderAsPaid(order.id);
      toast.success("Pesanan berhasil ditandai Lunas!");
      fetchOrderDetail();
    } catch (error) {
      toast.error("Gagal memperbarui status.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShipWithBiteship = async () => {
    if (!order.warehouse_id) {
      toast.error("Gudang asal belum ditentukan untuk pesanan ini!");
      return;
    }

    const adminData = JSON.parse(localStorage.getItem("okai_admin")) || {};
    let adminPhone = adminData.phone_number;
    if (!adminPhone) {
      adminPhone = window.prompt("Nomor telepon Anda belum terdaftar di profil. Silakan masukkan nomor telepon Anda:", "08...");
      if (!adminPhone || adminPhone === "08...") {
        toast.error("Nomor telepon wajib diisi untuk memproses pengiriman Biteship!");
        return;
      }
    }

    if (!window.confirm("Serahkan pesanan ini ke Ekspedisi via Biteship?")) return;
    setIsProcessing(true);
    try {
      // Map every item to the order's warehouse_id
      const itemWarehouses = {};
      const items = order.items || order.order_items || [];
      items.forEach(item => {
        itemWarehouses[item.id] = order.warehouse_id;
      });

      const data = {
        courier_company: selectedCourier,
        courier_type: selectedCourierType,
        item_warehouses: itemWarehouses,
        admin_phone: adminPhone
      };
      const result = await shipWithBiteship(order.id, data);
      
      if (result.success) {
        toast.success(result.message || "Berhasil diserahkan ke Ekspedisi!");
        fetchOrderDetail();
      } else {
        const biteshipError = result.error_from_biteship?.error || result.message || "Gagal menghubungi Biteship.";
        toast.error(`❌ Gagal: ${result.message}\n\nDetail: ${biteshipError}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem saat memproses pengiriman.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShipManual = async () => {
    if (!manualAwb.trim()) {
      toast.error("Nomor Resi (AWB) harus diisi!");
      return;
    }

    if (!window.confirm(`Kirim manual via ${selectedCourier.toUpperCase()} dengan resi ${manualAwb}?`)) return;
    setIsProcessing(true);
    try {
      const data = {
        courier_company: selectedCourier,
        awb_number: manualAwb
      };
      const result = await shipManual(order.id, data);
      
      if (result.success) {
        toast.success(result.message || "Status berhasil diubah ke Shipped!");
        fetchOrderDetail();
      } else {
        toast.error(`❌ Gagal: ${result.message}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem saat memproses pengiriman manual.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateDelivery = async () => {
    if (!window.confirm("Simulasikan pengiriman fiktif (Tandai Delivered)?")) return;
    setIsProcessing(true);
    try {
      await simulateDelivery(order.id);
      toast.success("Pesanan berhasil disimulasikan sebagai Terkirim!");
      fetchOrderDetail();
    } catch (error) {
      toast.error("Gagal mensimulasikan pengiriman.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncTracking = async () => {
    setIsProcessing(true);
    try {
      const adminData = JSON.parse(localStorage.getItem("okai_admin")) || {};
      const response = await fetch(`http://localhost:8000/api/orders/${order.id}/sync-tracking`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminData.token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchOrderDetail();
      } else {
        toast.error(result.message || "Gagal sinkronisasi status.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem saat sinkronisasi.");
    } finally {
      setIsProcessing(false);
    }
  };

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

  const orderItems = order.items || order.order_items || [];

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
          <div className="flex flex-col items-end gap-2">
            <div className="px-4 py-2 bg-[#F3EFE4] text-[#3A5034] rounded-full text-sm font-bold uppercase tracking-widest border border-[#EAE6D9]">
              Status: {order.status}
            </div>
          </div>
        </div>

        {/* ADMIN ACTION PANEL */}
        <div className="bg-white p-6 rounded-b-[2rem] border-x border-b border-[#EAE6D9] shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              {order.status === 'pending' && (
                <button disabled={isProcessing} onClick={handleMarkAsPaid} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                  <CreditCard size={18} /> Tandai Lunas (Paid)
                </button>
              )}
              
              {order.status === 'paid' && (
                <div className="flex flex-col w-full gap-4">
                  {/* PILIH METODE PENGIRIMAN */}
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="shippingMode" 
                        value="biteship" 
                        checked={shippingMode === "biteship"} 
                        onChange={(e) => setShippingMode(e.target.value)} 
                        className="accent-orange-600"
                      />
                      <span className="text-sm font-bold text-slate-700">Request Penjemputan (Biteship)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="shippingMode" 
                        value="manual" 
                        checked={shippingMode === "manual"} 
                        onChange={(e) => setShippingMode(e.target.value)} 
                        className="accent-orange-600"
                      />
                      <span className="text-sm font-bold text-slate-700">Kirim Manual</span>
                    </label>
                  </div>

                  {shippingMode === "biteship" ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex-1 w-full sm:w-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Kurir Pengiriman</p>
                        <div className="flex gap-2">
                          <select 
                            value={selectedCourier} 
                            onChange={(e) => setSelectedCourier(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                          >
                            <option value="jne">JNE</option>
                            <option value="sicepat">SiCepat</option>
                            <option value="jnt">J&T</option>
                            <option value="anteraja">AnterAja</option>
                            <option value="gojek">GoSend</option>
                            <option value="grab">GrabExpress</option>
                          </select>
                          <select 
                            value={selectedCourierType} 
                            onChange={(e) => setSelectedCourierType(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                          >
                            <option value="reg">Regular (REG)</option>
                            <option value="eco">Economy (ECO)</option>
                            <option value="yes">Next Day (YES)</option>
                            <option value="instant">Instant</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        disabled={isProcessing} 
                        onClick={handleShipWithBiteship} 
                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition disabled:opacity-50 disabled:bg-slate-300 mt-auto"
                      >
                        <Truck size={18} /> Kirim via Biteship (Shipped)
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-end gap-4 w-full bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex-1 w-full">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Kurir</label>
                        <select 
                          value={selectedCourier} 
                          onChange={(e) => setSelectedCourier(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          <option value="jne">JNE</option>
                          <option value="sicepat">SiCepat</option>
                          <option value="jnt">J&T</option>
                          <option value="anteraja">AnterAja</option>
                        </select>
                      </div>
                      <div className="flex-1 w-full">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nomor Resi (AWB)</label>
                        <input 
                          type="text" 
                          placeholder="Masukkan resi pengiriman..."
                          value={manualAwb}
                          onChange={(e) => setManualAwb(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                      <button 
                        disabled={isProcessing || !manualAwb.trim()} 
                        onClick={handleShipManual} 
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 mt-auto w-full sm:w-auto"
                      >
                        <Truck size={18} /> Update Status Shipped
                      </button>
                    </div>
                  )}
                </div>
              )}

              {order.status === 'shipped' && (
                <>
                  <button disabled={isProcessing} onClick={handleSyncTracking} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50">
                    <RefreshCw className={isProcessing ? "animate-spin" : ""} size={18} /> Sinkronisasi Status (Biteship)
                  </button>
                  <button disabled={isProcessing} onClick={handleSimulateDelivery} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50">
                    <CheckCircle size={18} /> Tandai Selesai (Delivered)
                  </button>
                </>
              )}
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
                <p><span className="text-[#5A665A] block text-xs">Nomor Resi</span> 
                  <span className="flex flex-wrap gap-1 mt-1">
                    {order.waybill_id ? order.waybill_id.split(',').map((resi, idx) => (
                      <span key={idx} className="font-semibold text-[#3A5034] text-xs tracking-wider bg-[#F3EFE4] px-2 py-1 rounded">
                        {resi.trim()}
                      </span>
                    )) : (
                      <span className="font-semibold text-[#3A5034] tracking-wider bg-[#F3EFE4] px-2 py-1 rounded">Belum diterbitkan</span>
                    )}
                  </span>
                </p>
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
                {orderItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 bg-[#FDFCF8] p-4 rounded-2xl border border-[#EAE6D9]/50">
                    <div className="flex justify-between items-center gap-4">
                      <div>
                        <p className="font-semibold text-[#2C352D]">{item.product?.name || "Produk Tidak Dikenal"}</p>
                        <p className="text-sm text-[#5A665A]">{item.quantity} x {formatIDR(item.price)}</p>
                      </div>
                      <p className="font-bold text-[#3A5034]">{formatIDR(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kalkulasi Total */}
              <div className="border-t border-[#EAE6D9] pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-[#5A665A]">
                  <span>Subtotal Produk</span>
                  <span className="font-medium text-[#2C352D]">{formatIDR(orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
                </div>
                <div className="flex justify-between text-[#5A665A]">
                  <span>Ongkos Kirim</span>
                  <span className="font-medium text-[#2C352D]">{formatIDR(order.shipping_cost || 0)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Diskon</span>
                    <span className="font-medium">-{formatIDR(order.discount_amount)}</span>
                  </div>
                )}
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