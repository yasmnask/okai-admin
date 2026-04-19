import React, { useState, useEffect } from "react";
import { getOrders } from "../services/api";
import {
  Package,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  Loader2,
} from "lucide-react";

export default function Orders() {
  // 1. State dari Naufal (Untuk Data API)
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. State dari Yasmin (Untuk Saringan Frontend)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");

  // Fungsi Menarik Data (Naufal)
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const result = await getOrders();
      if (result && result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Proses Penyaringan Data (Perpaduan Yasmin & Naufal)
  const filteredOrders = orders.filter((order) => {
    // A. Filter Pencarian (ID Pesanan atau Nama Customer)
    const matchSearch =
      searchKeyword === "" ||
      order.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchKeyword.toLowerCase());

    // B. Filter Status
    const matchStatus =
      selectedStatus === "" || order.status === selectedStatus;

    // C. Filter Pengiriman
    const matchShipping =
      selectedShipping === "" || order.method === selectedShipping;

    // D. Filter Tanggal (Menyamakan format YYYY-MM-DD dari kalender HTML dengan tanggal API)
    let matchDate = true;
    if (selectedDate && order.date) {
      // Mengubah "10 Mar 2026" menjadi format "2026-03-10" untuk dicocokkan
      const orderDateObj = new Date(order.date);
      const formattedOrderDate = orderDateObj.toISOString().split("T")[0];
      matchDate = formattedOrderDate === selectedDate;
    }

    return matchSearch && matchStatus && matchShipping && matchDate;
  });

  // Statistik Otomatis dari Data API (Naufal)
  const orderStats = [
    {
      label: "Total Pesanan",
      value: orders.length,
      icon: <ShoppingBag size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Sedang Diproses",
      value: orders.filter((o) => o.status === "Processing" || o.status === "Pending").length,
      icon: <Clock size={20} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Dalam Pengiriman",
      value: orders.filter((o) => o.status === "Shipped").length,
      icon: <Truck size={20} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Selesai/Tiba",
      value: orders.filter((o) => o.status === "Delivered").length,
      icon: <CheckCircle2 size={20} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-2xl font-black text-[#1E293B]">
          Order <span className="text-[#E65100]">Management</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium italic">
          Status "Delivered" otomatis memicu perhitungan komisi
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {orderStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div
              className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {stat.label}
            </p>
            <h2 className="text-2xl font-black mt-1 text-slate-800">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col xl:flex-row justify-between gap-4 items-center">
          <h3 className="font-black text-slate-800 text-lg">Recent Orders</h3>

          {/* FILTERS (Dari Yasmin) */}
          <div className="flex flex-wrap gap-2 w-full xl:w-auto">
            {/* SEARCH */}
            <div className="relative flex-1 md:flex-none">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari ID/Nama..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-40 bg-slate-50 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
              />
            </div>

            {/* DATE PICKER */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium outline-none"
            />

            {/* STATUS FILTER */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            {/* SHIPPING FILTER */}
            <select
              value={selectedShipping}
              onChange={(e) => setSelectedShipping(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium outline-none"
            >
              <option value="">All Shipping</option>
              <option value="Standard Reguler">Standard Reguler</option>
              <option value="JNE Reguler">JNE Reguler</option>
              <option value="SiCepat Best">SiCepat Best</option>
              <option value="Ambil di Gudang">Ambil di Gudang</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">
                Order ID & Date
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">
                Customer
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">
                Product
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center">
                Shipping
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">
                Status
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-10 text-center font-bold text-slate-400 animate-pulse">
                  Menarik data transaksi dari server...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center font-bold text-slate-400 italic">
                  Belum ada pesanan atau data tidak ditemukan.
                </td>
              </tr>
            ) : (
              // Menggunakan filteredOrders hasil penyaringan
              filteredOrders.map((order) => (
                <tr
                  key={order.raw_id || order.id}
                  className="hover:bg-orange-50/20 transition-colors group"
                >
                  <td className="p-6">
                    <p className="font-black text-[#E65100] text-[11px] tracking-wider uppercase">
                      {order.id}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                      {order.date}
                    </p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User size={14} />
                      </div>
                      <p className="font-bold text-slate-800">{order.customer}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-medium text-slate-600 line-clamp-1">
                      {order.items}
                    </p>
                    <p className="font-black text-slate-800 text-xs mt-1">
                      {order.total}
                    </p>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {order.method}
                      </span>
                      <MapPin size={12} className="text-slate-300" />
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1 ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Shipped"
                          ? "bg-purple-100 text-purple-600"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.status === "Delivered" ? (
                        <CheckCircle2 size={12} />
                      ) : order.status === "Shipped" ? (
                        <Truck size={12} />
                      ) : order.status === "Processing" ? (
                        <Package size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}