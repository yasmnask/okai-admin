import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, CreditCard, 
  Globe, DollarSign, Award, Calendar, Loader2,
  ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';
import { getAffiliateById } from '../services/api';

export default function DetailAffiliator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getAffiliateById(id);
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-[#E65100]" size={48} />
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold">Data tidak ditemukan</h2>
      <button onClick={() => navigate('/affiliates')} className="mt-4 text-[#E65100] font-bold">Kembali</button>
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate('/affiliates')}
          className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#E65100] transition-all shadow-sm"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">Detail <span className="text-[#E65100]">Mitra Afiliasi</span></h1>
          <p className="text-slate-400 text-sm font-medium">ID: {data.id} • Bergabung pada {data.program_details.joined_at}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: INFO UTAMA */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* PERSONAL INFO CARD */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={14} className="text-[#E65100]" /> Informasi Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Nama Lengkap</label>
                <p className="text-lg font-bold text-slate-800">{data.personal_info.full_name}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Email</label>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} /> <p className="font-medium">{data.personal_info.email}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Nomor Telepon</label>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={16} /> <p className="font-medium">{data.personal_info.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA CARD */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Globe size={14} className="text-[#E65100]" /> Media Sosial & Rencana Promosi
            </h3>
            {data.social_media.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.social_media.map((social, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase text-[#E65100]">
                        {social.platform}
                      </span>
                      {social.url && (
                        <a href={social.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#E65100]">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <p className="font-bold text-slate-800">@{social.username}</p>
                    <p className="text-xs text-slate-500 mt-2 italic">"{social.plan || 'Tidak ada rencana promosi khusus'}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm text-center py-4">Belum ada data media sosial.</p>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: STATUS & KEUANGAN */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* PROGRAM STATUS */}
          <div className="bg-[#1E293B] p-8 rounded-[2.5rem] text-white shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Program</p>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${data.program_details.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'}`}>
                {data.program_details.status}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400 font-medium">Kode Referal</span>
                <span className="text-sm font-black text-orange-400">{data.program_details.affiliate_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400 font-medium">Rate Komisi</span>
                <span className="text-sm font-black">{data.program_details.commission_rate}</span>
              </div>
            </div>
          </div>

          {/* BANKING INFO */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CreditCard size={14} className="text-[#E65100]" /> Informasi Bank
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Bank</p>
                <p className="text-sm font-bold text-slate-800">{data.banking_info.bank_name}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Nomor Rekening</p>
                <p className="text-sm font-bold text-slate-800 tracking-wider">{data.banking_info.account_number}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Atas Nama</p>
                <p className="text-sm font-bold text-slate-800">{data.banking_info.account_holder}</p>
              </div>
            </div>
          </div>

          {/* COMMISSION SUMMARY */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <DollarSign size={14} className="text-[#E65100]" /> Ringkasan Komisi
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3">
                <span className="text-xs font-medium text-slate-500">Telah Dibayar</span>
                <span className="text-sm font-black text-green-600">Rp {new Intl.NumberFormat('id-ID').format(data.commission_summary.paid)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-2xl">
                <span className="text-xs font-medium text-orange-700">Menunggu</span>
                <span className="text-sm font-black text-orange-600">Rp {new Intl.NumberFormat('id-ID').format(data.commission_summary.pending)}</span>
              </div>
              <hr className="border-slate-50" />
              <div className="flex justify-between items-center p-3">
                <span className="text-xs font-black text-slate-800">Total Akumulasi</span>
                <span className="text-lg font-black text-slate-800">Rp {new Intl.NumberFormat('id-ID').format(data.commission_summary.total_earnings)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}