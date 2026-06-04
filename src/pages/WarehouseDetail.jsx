import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { ArrowLeft, Box, Plus, Search, Edit3, Save, MapPin } from "lucide-react";
import { getWarehouseById, updateProductStock, getProducts } from "../services/api";

export default function WarehouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Modal State for Adding/Editing Stock
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockFormData, setStockFormData] = useState({
    id_product: "",
    stock: 0
  });

  const fetchWarehouseDetail = async () => {
    try {
      setIsLoading(true);
      const res = await getWarehouseById(id);
      if (res && res.success) {
        setWarehouse(res.data);
        setProducts(res.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching warehouse detail:", error);
      toast.error("Gagal memuat detail gudang.");
      navigate("/warehouses");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await getProducts();
      if (res && res.success) {
        setAllProducts(res.data);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  useEffect(() => {
    fetchWarehouseDetail();
    fetchAllProducts();
  }, [id]);

  const handleOpenStockModal = (product = null) => {
    if (product) {
      setStockFormData({
        id_product: product.id_product,
        stock: product.stock
      });
    } else {
      setStockFormData({
        id_product: "",
        stock: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseStockModal = () => {
    setIsModalOpen(false);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockFormData.id_product) {
      toast.error("Pilih produk terlebih dahulu!");
      return;
    }
    try {
      await updateProductStock(id, stockFormData);
      handleCloseStockModal();
      fetchWarehouseDetail();
    } catch (error) {
      toast.error("Gagal memperbarui stok.");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    p.product_sku.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center mt-20">Memuat detail gudang...</div>;
  }

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 dark:bg-[#1a1e1a]/80 backdrop-blur-md py-4 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/warehouses")}
            className="p-2.5 bg-white dark:bg-[#2a2d2a] border border-slate-200 dark:border-transparent rounded-2xl text-slate-400 hover:text-[#E65100] transition-all shadow-sm"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <MapPin size={12} /> {warehouse?.city || "Lokasi"}
            </div>
            <h1 className="text-2xl font-black text-[#1E293B] dark:text-white transition-colors">
              Gudang: <span className="text-[#E65100]">{warehouse?.name}</span>
            </h1>
          </div>
        </div>
        <button
          onClick={() => handleOpenStockModal()}
          className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 dark:shadow-black hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Tambah/Update Stok Produk
        </button>
      </div>

      <div className="bg-white dark:bg-[#3e3c3a] p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-0 dark:shadow-black flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari SKU atau nama produk di gudang ini..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#1a1d1a] dark:text-slate-300 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-0 dark:shadow-md dark:shadow-black overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-[#3e3c3a] border-b border-slate-100 dark:border-black">
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Produk & SKU</th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">Stok</th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-black">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-20 text-center text-slate-400 dark:text-slate-300/30 font-bold italic">
                  Belum ada produk terdaftar di gudang ini.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id_product_warehouse} className="hover:bg-orange-50/30 dark:hover:bg-[#3e3c3a]/20 transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{p.product_name}</p>
                    <p className="text-[10px] font-black text-[#E65100] tracking-wider uppercase">{p.product_sku}</p>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{p.stock} Unit</span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={() => handleOpenStockModal(p)} className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white dark:hover:bg-[#3e3c3a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <Edit3 size={18} /> Edit Stok
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1d1a] w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border dark:border-slate-800/50">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800/50">
              <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Box className="text-[#E65100]" /> Kelola Stok Produk
              </h2>
            </div>
            <form onSubmit={handleStockSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Pilih Produk</label>
                <select 
                  required 
                  value={stockFormData.id_product} 
                  onChange={(e) => setStockFormData({...stockFormData, id_product: e.target.value})} 
                  className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="" disabled>-- Pilih Produk --</option>
                  {allProducts.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name} ({prod.sku})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Stok Tersedia</label>
                <input 
                  required 
                  type="number" 
                  min="0"
                  value={stockFormData.stock} 
                  onChange={(e) => setStockFormData({...stockFormData, stock: parseInt(e.target.value) || 0})} 
                  className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" 
                />
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/50">
                <button type="button" onClick={handleCloseStockModal} className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-6 py-2.5 bg-[#E65100] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
