import React from 'react';
import { KeyRound, Mail, User, ShieldCheck } from 'lucide-react';

export default function ProfileSettings() { // Nama fungsi diganti
  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black mb-2 text-[#1E293B]">Profile <span className="text-[#E65100]">Settings</span></h1>
        <p className="text-slate-400 text-sm mb-10 font-medium italic">Update informasi profil dan keamanan akun OKAI</p>

        <div className="space-y-6">
          {/* Informasi Profil */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
              <User size={18} className="text-[#E65100]" /> Data Diri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="text" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="Muhammad Fawwas" />
                </div>
              </div>
            </div>
          </div>

          {/* Keamanan */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
              <ShieldCheck size={18} className="text-[#E65100]" /> Ganti Password
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="password" placeholder="Password Baru" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" />
                <input type="password" placeholder="Ulangi Password" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button className="px-8 py-3 bg-[#E65100] text-white font-bold rounded-2xl shadow-lg shadow-orange-100 hover:brightness-110 transition-all">Update Profil</button>
          </div>
        </div>
      </div>
    </div>
  );
}