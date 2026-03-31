import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Ticket, Percent, 
  DollarSign, Calendar, Users, Info, 
  Settings, Zap, Clock, Loader2
} from 'lucide-react';
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

  // 1. Tarik data promo lama saat halaman dibuka
  useEffect(() => {
    const loadPromo = async () => {
      try {
        const response = await getPromotionById(id);
        if (response.success) {
          setFormData(response.data);
        } else {
          alert("Voucher tidak ditemukan!");
          navigate('/promotions');
        }
      } catch (error) {
        console.error("Error loading promo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPromo();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await updatePromotion(id, formData);
      if(response.success) {
        navigate('/promotions');
      } else {
        alert("Gagal update promo!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-[#E65100]" size={48} />
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/promotions')} className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#E65100] transition-all shadow-sm">
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <Zap size={12} /> Editing Voucher: {id}
            </div>
            <h1 className="text-2xl font-black text-[#1E293B]">Update <span className="text-[#E65100]">Kampanye Diskon</span></h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => navigate('/promotions')} className="px-6 py-3.5 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200">
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3.5 bg-[#1E293B] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Updating..." : <><Save size={18} /> Simpan Perubahan</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          {/* Identitas Voucher */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
              <Ticket size={16} className="text-[#E65100]" /> Identitas Voucher
            </h3>
            <div className="space-y-6">
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-lg outline-none focus:border-orange-100 font-black text-[#E65100]" 
              />
              <textarea 
                rows="3" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm outline-none focus:border-orange-100 font-medium"
              ></textarea>
            </div>
          </div>

          {/* Pengaturan Potongan */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
              <Settings size={16} className="text-[#E65100]" /> Pengaturan Potongan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'percentage'})}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'percentage' ? 'border-[#E65100] bg-orange-50' : 'border-slate-100'}`}
                >
                  <Percent size={20} className={formData.type === 'percentage' ? 'text-[#E65100]' : 'text-slate-300'} />
                  <span className="text-[10px] font-black uppercase">Persentase</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'fixed_amount'})}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'fixed_amount' ? 'border-[#E65100] bg-orange-50' : 'border-slate-100'}`}
                >
                  <DollarSign size={20} className={formData.type === 'fixed_amount' ? 'text-[#E65100]' : 'text-slate-300'} />
                  <span className="text-[10px] font-black uppercase">Nominal</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300">
                  {formData.type === 'percentage' ? '%' : 'Rp'}
                </span>
                <input 
                  type="number" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 rounded-[1.5rem] text-lg font-black outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR LIMIT & STATUS */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-[#E65100]" /> Masa Berlaku
            </h3>
            <div className="space-y-4">
              <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none" />
              <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none" />
            </div>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-[3rem] shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Voucher Status</p>
              <button 
                onClick={() => setFormData({...formData, is_active: formData.is_active ? 0 : 1})}
                className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${formData.is_active ? 'bg-green-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <p className="text-xs font-bold text-slate-300">
              {formData.is_active ? 'Voucher sedang aktif digunakan.' : 'Voucher sedang dinonaktifkan.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}