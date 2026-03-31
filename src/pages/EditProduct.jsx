import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Box,
  Info,
  Settings,
  Eye,
  Barcode,
  Layers,
  MapPin,
  Loader2,
} from "lucide-react";
import { getProductById, updateProduct } from "../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Electronic",
    warehouse: "Gudang Utama (Surabaya)",
    description: "",
    price: "",
    stock: 0,
    image_url: "",
    is_active: 1,
  });

  // 1. Tarik data lama dari MySQL saat halaman dibuka
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const response = await getProductById(id);
        if (response.success) {
          // Map data dari DB ke State Form
          setFormData({
            ...response.data,
            // Pastikan is_active dikonversi ke number untuk toggle
            is_active: parseInt(response.data.is_active),
          });
        } else {
          alert("Produk tidak ditemukan!");
          navigate("/product");
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Casting data agar Laravel tidak protes
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      is_active: formData.is_active ? 1 : 0,
    };

    try {
      const response = await updateProduct(id, payload);
      if (response.success) {
        navigate("/product");
      } else {
        alert(
          "Gagal update: " +
            JSON.stringify(response.errors || "Cek koneksi server"),
        );
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <Loader2 className="animate-spin text-[#E65100]" size={40} />
        <p className="text-slate-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">
          Sinking Data...
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/product")}
            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#E65100] transition-all"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <Box size={12} /> ID: {id}
            </div>
            <h1 className="text-2xl font-black text-[#1E293B]">
              Edit <span className="text-[#E65100]">Product</span>
            </h1>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/product")}
            className="flex-1 md:flex-none px-6 py-3.5 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-10 py-3.5 bg-[#1E293B] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Updating..."
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* KIRI: DETAIL KONTEN */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
              <Info size={16} className="text-[#E65100]" /> Content Editor
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm outline-none focus:border-orange-100 focus:bg-white transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    SKU Code
                  </label>
                  <div className="relative">
                    <Barcode
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>

              <textarea
                rows="8"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm outline-none focus:border-orange-100 focus:bg-white transition-all font-medium leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        {/* KANAN: METADATA & SIDEBAR */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings size={16} className="text-[#E65100]" /> Inventory
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                  Harga Jual
                </label>
                <div className="flex items-center gap-2 text-lg font-black">
                  <span className="text-slate-300">Rp</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="bg-transparent w-full outline-none"
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                  Stok Tersedia
                </label>
                <div className="flex items-center gap-2 text-lg font-black text-orange-600">
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="bg-transparent w-full outline-none"
                  />
                  <span className="text-[10px] text-slate-300 uppercase">
                    Unit
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Layers size={12} /> Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Electronic">Electronic</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <MapPin size={12} /> Warehouse
                </label>
                <select
                  value={formData.warehouse}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouse: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Gudang Utama (Surabaya)">
                    Gudang Utama (Surabaya)
                  </option>
                  <option value="Gudang Jakarta">Gudang Jakarta</option>
                  <option value="Gudang Sidoarjo">Gudang Sidoarjo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              {formData.is_active ? "Published" : "Draft"}
            </p>
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  is_active: formData.is_active ? 0 : 1,
                })
              }
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.is_active ? "bg-green-500" : "bg-slate-200"}`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${formData.is_active ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </button>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-[3rem] shadow-2xl text-white">
            <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <ImageIcon size={14} className="text-[#E65100]" /> Product Image
            </h3>
            <div className="w-full aspect-square bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden mb-4">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={32} className="opacity-20" />
              )}
            </div>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
