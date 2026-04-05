import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Ticket, Percent, 
  DollarSign, Calendar, Users, Info, 
  Settings, Zap, Clock
} from 'lucide-react';
// 1. Import fungsi API
import { addPromotion } from '../services/api';

export default function AddPromotion() {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 2. Pastikan tipe data angka dikonversi dengan benar untuk Laravel
    const payload = {
      ...formData,
      value: Number(formData.value),
      max_usage: Number(formData.max_usage)
    };

    try {
      const response = await addPromotion(payload);
      
      if(response.success) {
        navigate('/promotions');
      } else {
        // Sensor Error dari Server
        const serverError = response.message ? response.message : JSON.stringify(response.errors);
        alert("❌ Gagal menyimpan kupon!\n\nAlasan: " + serverError);
      }
    } catch (error) {
      alert("Error Jaringan: Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/promotions')} 
            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#E65100] transition-all shadow-sm"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <Zap size={12} /> Marketing Tools
            </div>
            <h1 className="text-2xl font-black text-[#1E293B]">Buat <span className="text-[#E65100]">Promo Baru</span></h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3.5 bg-[#E65100] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Menyimpan..." : <><Save size={18} /> Aktifkan Voucher</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* KIRI: KONFIGURASI UTAMA */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
              <Ticket size={16} className="text-[#E65100]" /> Identitas Voucher
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Kode Promo (Voucher Code)</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-lg outline-none focus:border-orange-100 focus:bg-white transition-all font-black placeholder:font-bold text-[#E65100]" 
                  placeholder="CONTOH: OKAI-MERDEKA" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Deskripsi Singkat</label>
                <textarea 
                  rows="3" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm outline-none focus:border-orange-100 focus:bg-white transition-all font-medium" 
                  placeholder="Misal: Diskon khusus hari kemerdekaan untuk semua produk..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
              <Settings size={16} className="text-[#E65100]" /> Pengaturan Potongan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Tipe Diskon</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'percentage'})}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'percentage' ? 'border-[#E65100] bg-orange-50' : 'border-slate-100'}`}
                  >
                    <Percent size={20} className={formData.type === 'percentage' ? 'text-[#E65100]' : 'text-slate-300'} />
                    <span className={`text-[10px] font-black uppercase ${formData.type === 'percentage' ? 'text-[#E65100]' : 'text-slate-400'}`}>Persentase</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'fixed_amount'})}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'fixed_amount' ? 'border-[#E65100] bg-orange-50' : 'border-slate-100'}`}
                  >
                    <DollarSign size={20} className={formData.type === 'fixed_amount' ? 'text-[#E65100]' : 'text-slate-300'} />
                    <span className={`text-[10px] font-black uppercase ${formData.type === 'fixed_amount' ? 'text-[#E65100]' : 'text-slate-400'}`}>Nominal Tetap</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nilai Potongan</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300">
                    {formData.type === 'percentage' ? '%' : 'Rp'}
                  </span>
                  <input 
                    type="number" 
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-lg font-black outline-none focus:ring-2 focus:ring-orange-500/20" 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KANAN: LIMIT & JADWAL */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-[#E65100]" /> Masa Berlaku
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mulai Tanggal</label>
                <input 
                  type="date" 
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none" 
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Berakhir Tanggal</label>
                <input 
                  type="date" 
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users size={16} className="text-[#E65100]" /> Batas Penggunaan
            </h3>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Maksimal Pemakaian (User)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={formData.max_usage}
                  onChange={(e) => setFormData({...formData, max_usage: e.target.value})}
                  className="bg-transparent w-full text-xl font-black outline-none text-slate-700" 
                  placeholder="500"
                />
                <span className="text-[10px] font-black text-slate-300 uppercase">Kupon</span>
              </div>
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
              {formData.is_active ? 'Promo akan langsung aktif saat disimpan.' : 'Simpan sebagai draft sementara.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}