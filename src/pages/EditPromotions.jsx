import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Save, Ticket, Percent, 
  DollarSign, Calendar, Users, Info, 
  Settings, Zap, Clock, Loader2
} from 'lucide-react';
// 1. Import fungsi API Edit & Tarik Data
import { getPromotionById, updatePromotion } from '../services/api';

export default function EditPromotion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    max_usage: '',
    start_date: '',
    end_date: '',
    is_active: 1
  });

  useEffect(() => {
    const loadPromo = async () => {
      try {
        const response = await getPromotionById(id);
        if (response.success) {
          const promoData = response.data;
          
          // Helper untuk memastikan format tanggal aman dipotong ke YYYY-MM-DD
          const formatDate = (dateString) => {
            if (!dateString) return '';
            return dateString.substring(0, 10);
          };

          setFormData({
            ...promoData,
            start_date: formatDate(promoData.start_date),
            end_date: formatDate(promoData.end_date),
          });
        } else {
          toast.error("Voucher tidak ditemukan!");
          navigate('/promotions');
        }
      } catch (error) {
        console.error("Error loading promo:", error);
        toast.error("Gagal memuat data promo.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPromo();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Pastikan tipe data dikonversi ke angka sebelum dikirim
    const payload = {
      ...formData,
      value: Number(formData.value),
      max_usage: Number(formData.max_usage)
    };

    try {
      const response = await updatePromotion(id, payload);
      if(response.success) {
        navigate('/promotions');
      } else {
        const serverError = response.message ? response.message : JSON.stringify(response.errors);
        toast.error("❌ Gagal mengupdate kupon!\n\nAlasan: " + serverError);
      }
    } catch (error) {
      toast.error("Error Jaringan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#1a1e1a] transition-colors">
      <Loader2 className="animate-spin text-[#E65100]" size={48} />
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans transition-colors">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 dark:bg-[#1a1e1a]/80 backdrop-blur-md py-4 transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/promotions')} className="p-2.5 bg-white dark:bg-[#2a2d2a] border border-slate-200 dark:border-transparent rounded-2xl text-slate-400 hover:text-[#E65100] transition-all shadow-sm">
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <Zap size={12} /> Editing Voucher: {id}
            </div>
            <h1 className="text-2xl font-black text-[#1E293B] dark:text-white transition-colors">Update <span className="text-[#E65100]">Kampanye Diskon</span></h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => navigate('/promotions')} className="px-6 py-3.5 bg-white dark:bg-[#2a2d2a] text-slate-500 dark:text-slate-400 rounded-2xl font-bold border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3.5 bg-[#1E293B] dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Updating..." : <><Save size={18} /> Simpan Perubahan</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          {/* Identitas Voucher */}
          <div className="bg-white dark:bg-[#1a1d1a] p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800/50 transition-colors">
            <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2 mb-8 transition-colors">
              <Ticket size={16} className="text-[#E65100]" /> Identitas Voucher
            </h3>
            <div className="space-y-6">
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full p-5 bg-slate-50 dark:bg-[#2a2d2a] border-2 border-transparent rounded-[1.5rem] text-lg outline-none focus:border-orange-100 dark:focus:border-orange-900/50 font-black text-[#E65100] dark:text-orange-400 transition-colors" 
              />
              <textarea 
                rows="3" 
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-6 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-2 border-transparent rounded-[1.5rem] text-sm outline-none focus:border-orange-100 dark:focus:border-orange-900/50 font-medium transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
              ></textarea>
            </div>
          </div>

          {/* Pengaturan Potongan */}
          <div className="bg-white dark:bg-[#1a1d1a] p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800/50 transition-colors">
            <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2 mb-8 transition-colors">
              <Settings size={16} className="text-[#E65100]" /> Pengaturan Potongan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'percentage'})}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'percentage' ? 'border-[#E65100] bg-orange-50 dark:bg-orange-900/20' : 'border-slate-100 dark:border-slate-700/50 dark:hover:border-slate-600'}`}
                >
                  <Percent size={20} className={formData.type === 'percentage' ? 'text-[#E65100]' : 'text-slate-300 dark:text-slate-500'} />
                  <span className={`text-[10px] font-black uppercase ${formData.type === 'percentage' ? 'text-[#E65100]' : 'text-slate-400 dark:text-slate-400'}`}>Persentase</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'fixed_amount'})}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'fixed_amount' ? 'border-[#E65100] bg-orange-50 dark:bg-orange-900/20' : 'border-slate-100 dark:border-slate-700/50 dark:hover:border-slate-600'}`}
                >
                  <DollarSign size={20} className={formData.type === 'fixed_amount' ? 'text-[#E65100]' : 'text-slate-300 dark:text-slate-500'} />
                  <span className={`text-[10px] font-black uppercase ${formData.type === 'fixed_amount' ? 'text-[#E65100]' : 'text-slate-400 dark:text-slate-400'}`}>Nominal</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 dark:text-slate-500">
                  {formData.type === 'percentage' ? '%' : 'Rp'}
                </span>
                <input 
                  type="number" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white rounded-[1.5rem] text-lg font-black outline-none transition-colors" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR LIMIT & STATUS */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800/50 transition-colors">
            <h3 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-widest mb-6 flex items-center gap-2 transition-colors">
              <Clock size={16} className="text-[#E65100]" /> Masa Berlaku
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block transition-colors">Tanggal Mulai</label>
                <input 
                  type="date" 
                  value={formData.start_date} 
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})} 
                  className="w-full p-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white rounded-2xl text-sm font-bold outline-none transition-colors border border-transparent focus:border-orange-500" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block transition-colors">Tanggal Berakhir</label>
                <input 
                  type="date" 
                  value={formData.end_date} 
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})} 
                  className="w-full p-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white rounded-2xl text-sm font-bold outline-none transition-colors border border-transparent focus:border-orange-500" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800/50 transition-colors">
            <h3 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-widest mb-6 flex items-center gap-2 transition-colors">
              <Users size={16} className="text-[#E65100]" /> Batas Penggunaan
            </h3>
            <div className="bg-slate-50 dark:bg-[#2a2d2a] p-5 rounded-3xl border border-slate-100 dark:border-transparent transition-colors">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block transition-colors">Maksimal Pemakaian (User)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={formData.max_usage}
                  onChange={(e) => setFormData({...formData, max_usage: e.target.value})}
                  className="bg-transparent w-full text-xl font-black outline-none text-slate-700 dark:text-white transition-colors" 
                />
                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase transition-colors">Kupon</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] dark:bg-[#2a2d2a] p-8 rounded-[3rem] shadow-2xl dark:shadow-none text-white transition-colors">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">Voucher Status</p>
              <button 
                onClick={() => setFormData({...formData, is_active: formData.is_active ? 0 : 1})}
                className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${formData.is_active ? 'bg-green-500 dark:bg-green-600' : 'bg-slate-700 dark:bg-slate-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <p className="text-xs font-bold text-slate-300 dark:text-slate-300 transition-colors">
              {formData.is_active ? 'Voucher sedang aktif digunakan.' : 'Voucher sedang dinonaktifkan.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}