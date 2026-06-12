import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  MessageSquare,
  Star,
  X,
  Reply,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  getProducts,
  deleteProduct,
  getProductReviews,
  replyToReview,
} from "../services/api";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // filter states
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // === STATE UNTUK MODAL ULASAN ===
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  // State untuk form balasan (inline)
  const [replyingToReviewId, setReplyingToReviewId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

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
        toast.error("Gagal menghapus produk");
      }
    }
  };

  // === FUNGSI MANAJEMEN ULASAN ===
  const openReviewsModal = async (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
    setReplyingToReviewId(null);
    setReplyText("");
    fetchProductReviews(product.id);
  };

  const fetchProductReviews = async (productId) => {
    setIsReviewsLoading(true);
    try {
      const response = await getProductReviews(productId);
      if (response.success) {
        setProductReviews(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil ulasan produk:", error);
      toast.error("Gagal memuat ulasan.");
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleOpenReplyForm = (review) => {
    setReplyingToReviewId(review.id);
    setReplyText(review.admin_reply || "");
  };

  const handleSendReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error("Teks balasan tidak boleh kosong!");
      return;
    }

    setIsSubmittingReply(true);
    try {
      const response = await replyToReview(reviewId, replyText);

      if (response.success) {
        toast.success("Balasan berhasil dikirim! 🚀");
        setReplyingToReviewId(null);
        setReplyText("");
        fetchProductReviews(selectedProduct.id); // Refresh daftar ulasan
      }
    } catch (error) {
      console.error("Gagal mengirim balasan:", error);
      toast.error("Gagal mengirim balasan ke server.");
    } finally {
      setIsSubmittingReply(false);
    }
  };
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={`${
          index < rating
            ? "fill-orange-400 text-orange-400"
            : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
        }`}
      />
    ));
  };

  // Kategori resmi KAMBI
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
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B] dark:text-white">
            KAMBI <span className="text-[#E65100]">Catalog</span>
          </h1>
          <p className="text-slate-400 dark:text-[#e1d4cc] text-sm font-medium">
            Kelola katalog produk susu premium dan merchandise KAMBI
          </p>
        </div>
        <button
          onClick={() => navigate("/product/create")}
          className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 dark:shadow-black hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Tambah Produk Baru
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-[#3e3c3a] p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-0 dark:shadow-black flex flex-col md:flex-row gap-4 mb-8">
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
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#1a1d1a] dark:text-slate-300 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
          />
        </div>

        <div className="flex gap-2">
          {/* CATEGORY (LEFT) */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-5 py-3 bg-slate-50 dark:bg-[#1a1d1a] text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold border border-slate-100 dark:border-0 outline-none"
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
            className="px-5 py-3 bg-slate-50 dark:bg-[#1a1d1a] text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold border border-slate-100 dark:border-0 outline-none"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-0 dark:shadow-md dark:shadow-black overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-[#3e3c3a] border-b border-slate-100 dark:border-black">
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                Produk & SKU
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                Kategori
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                Harga
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">
                Program Afiliasi
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">
                Status
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 dark:divide-black">
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-20 text-center text-slate-400 dark:text-slate-600 font-bold animate-pulse"
                >
                  Mengambil data produk dari server...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-20 text-center text-slate-400 dark:text-slate-300/30 font-bold italic"
                >
                  Belum ada produk KAMBI yang terdaftar.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-orange-50/30 dark:hover:bg-[#3e3c3a]/20 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-50 dark:bg-[#3e3c3a] rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
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
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {product.name}
                        </p>
                        <p className="text-[10px] font-black text-[#E65100] tracking-wider uppercase">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {product.category}
                  </td>

                  <td className="p-6 text-sm font-black text-slate-800 dark:text-slate-200">
                    {product.price}
                  </td>

                  <td className="p-6 text-center">
                    {product.is_affiliate_enabled ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        🔥 Aktif ({product.affiliate_commission || 15}%)
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        Nonaktif
                      </span>
                    )}
                  </td>

                  <td className="p-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        product.status === "Published"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="p-6">
                    <div className="flex justify-center items-center gap-2">
                      {/* TOMBOL ULASAN */}
                      <button
                        onClick={() => openReviewsModal(product)}
                        title="Lihat Ulasan"
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-[#3e3c3a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/product/edit/${product.id}`)}
                        title="Edit Produk"
                        className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white dark:hover:bg-[#3e3c3a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        title="Hapus Produk"
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-[#3e3c3a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
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

        {/* PAGINATION (Sesuai kode aslimu) */}
        <div className="p-6 border-t border-slate-50 dark:border-black flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-300">
          <p>Showing 1 to {filteredProducts.length} Products</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-50 dark:bg-[#E65100] dark:text-white rounded-lg hover:bg-[#E65100] dark:hover:bg-[#3e3c3a]/50 hover:text-white transition-colors">
              Prev
            </button>
            <button className="px-4 py-2 bg-slate-50 dark:bg-[#E65100] dark:text-white rounded-lg hover:bg-[#E65100] dark:hover:bg-[#3e3c3a]/50 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL MANAJEMEN ULASAN PRODUK */}
      {/* ========================================= */}
      {isReviewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1d1a] rounded-[2rem] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#3e3c3a]/50 rounded-t-[2rem]">
              <div>
                <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#E65100]" />
                  Ulasan Pembeli
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Produk:{" "}
                  <span className="text-[#E65100]">{selectedProduct.name}</span>
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-white dark:hover:bg-black/20 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#F8FAFC] dark:bg-[#1a1e1a]">
              {isReviewsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2
                    size={40}
                    className="animate-spin text-[#E65100] mb-4"
                  />
                  <p className="font-bold text-sm">Menarik data ulasan...</p>
                </div>
              ) : productReviews.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1a1d1a] rounded-3xl border border-slate-100 dark:border-slate-800">
                  <MessageSquare
                    size={48}
                    className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
                  />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Belum ada ulasan untuk produk ini.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white dark:bg-[#1a1d1a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#E65100] font-black flex items-center justify-center">
                            {review.user?.name
                              ? review.user.name.charAt(0).toUpperCase()
                              : "A"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                              {review.user?.name || "Anonim"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold">
                              {new Date(review.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                        {review.comment || (
                          <span className="italic opacity-50">
                            Tanpa komentar tertulis
                          </span>
                        )}
                      </p>

                      {/* Galeri Foto */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((img, idx) => (
                            <a
                              href={img}
                              target="_blank"
                              rel="noreferrer"
                              key={idx}
                            >
                              <img
                                src={img}
                                alt="Review"
                                className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Cari blok kode Area Balasan di ProductManagement.jsx kamu, lalu ganti dengan ini */}
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {replyingToReviewId === review.id ? (
                          // Form Input saat tombol Balas/Edit diklik
                          <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                            <label className="block text-[10px] font-black text-[#E65100] uppercase tracking-widest mb-2">
                              {review.admin_reply
                                ? "Edit Balasan Toko"
                                : "Tulis Balasan Toko"}
                            </label>
                            <textarea
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Terima kasih atas ulasannya kak..."
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1d1a] text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-orange-500 mb-3"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReplyingToReviewId(null)}
                                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => handleSendReply(review.id)}
                                disabled={isSubmittingReply}
                                className="px-4 py-2 bg-[#E65100] text-white text-xs font-bold rounded-lg hover:bg-[#cc4800] transition-all flex items-center gap-2"
                              >
                                {isSubmittingReply ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}
                                Simpan Balasan
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Tampilan awal sebelum tombol diklik
                          <div>
                            {review.admin_reply ? (
                              // JIKA SUDAH DIBALAS: Tampilkan balasan kuno & ganti tombol jadi "Edit Balasan"
                              <div className="bg-[#F8FAFC] dark:bg-[#3e3c3a]/30 p-4 rounded-2xl border-l-4 border-green-500 flex justify-between items-start">
                                <div>
                                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">
                                    ✓ Sudah Dibalas Anda
                                  </p>
                                  <p className="text-slate-600 dark:text-slate-400 text-xs italic">
                                    "{review.admin_reply}"
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleOpenReplyForm(review)}
                                  className="text-xs font-bold text-blue-500 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              // JIKA BELUM DIBALAS: Tampilkan tombol "Balas Ulasan Ini"
                              <button
                                onClick={() => handleOpenReplyForm(review)}
                                className="text-xs font-bold text-[#E65100] flex items-center gap-1.5 hover:underline bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg"
                              >
                                <Reply size={14} /> Balas Ulasan Ini
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
