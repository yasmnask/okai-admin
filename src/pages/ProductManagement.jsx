import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Search, Edit3, Trash2, MapPin } from "lucide-react";
import { getProducts, deleteProduct } from "../services/api";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // filter states
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // 1. Fetch data asli dari server
  const fetchProducts = async (query = "") => {
    try {
      setIsLoading(true);
      const result = await getProducts(query);
      if (result && result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efek khusus untuk Pencarian (Debounce 500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchKeyword);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk KAMBI ini?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert("Gagal menghapus produk");
      }
    }
  };

  // Kategori resmi KAMBI (Digabung dengan data lama jika ada sisa data dummy)
  const baseCategories = [
    "Bubuk Premium",
    "Herbal Spesial",
    "Paket Keluarga",
    "Perawatan Tubuh",
    "Merchandise",
  ];
  const categories = [
    "All Categories",
    ...new Set([...baseCategories, ...products.map((p) => p.category)]),
  ];

  // filter logic
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    const matchStatus =
      selectedStatus === "All Status" || product.status === selectedStatus;

    return matchCategory && matchStatus;
  });

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">
            KAMBI <span className="text-[#E65100]">Catalog</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Kelola katalog produk susu premium dan merchandise KAMBI
          </p>
        </div>
        <button
          onClick={() => navigate("/product/create")}
          className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Tambah Produk Baru
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari SKU atau nama produk KAMBI..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
          />
        </div>

        <div className="flex gap-2">
          {/* CATEGORY (LEFT) */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-slate-100 outline-none"
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* STATUS (RIGHT) */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-slate-100 outline-none"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Produk & SKU
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Kategori
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Harga
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Stok & Lokasi
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Status
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-20 text-center text-slate-400 font-bold animate-pulse"
                >
                  Mengambil data produk dari server...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-20 text-center text-slate-400 font-bold italic"
                >
                  Belum ada produk KAMBI yang terdaftar.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-orange-50/30 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <Package className="text-orange-500" size={24} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {product.name}
                        </p>
                        <p className="text-[10px] font-black text-[#E65100] tracking-wider uppercase">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-sm font-semibold text-slate-500">
                    {product.category}
                  </td>

                  <td className="p-6 text-sm font-black text-slate-800">
                    {product.price}
                  </td>

                  <td className="p-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-slate-700">
                        {product.stock} Unit
                      </span>
                      <div className="flex items-center text-[10px] text-slate-400 font-medium italic">
                        <MapPin size={10} className="mr-1 text-orange-400" />
                        {product.warehouse}
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        product.status === "Published"
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="p-6">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => navigate(`/product/edit/${product.id}`)}
                        className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-6 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400">
          <p>Showing 1 to {filteredProducts.length} Products</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-50 rounded-lg hover:bg-[#E65100] hover:text-white transition-colors">
              Prev
            </button>
            <button className="px-4 py-2 bg-slate-50 rounded-lg hover:bg-[#E65100] hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
